# Visitor counter: HTTP API -> Lambda (Python) -> DynamoDB

resource "aws_dynamodb_table" "counter" {
  name         = "${var.project}-visitors"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

data "archive_file" "counter" {
  type        = "zip"
  source_file = "${path.module}/../backend/visitor_counter/handler.py"
  output_path = "${path.module}/build/visitor_counter.zip"
}

resource "aws_cloudwatch_log_group" "counter" {
  name              = "/aws/lambda/${var.project}-visitor-counter"
  retention_in_days = 14
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "counter" {
  name               = "${var.project}-visitor-counter"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

# Least privilege: one table, one action, plus its own log group
data "aws_iam_policy_document" "counter" {
  statement {
    actions   = ["dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.counter.arn]
  }

  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.counter.arn}:*"]
  }
}

resource "aws_iam_role_policy" "counter" {
  name   = "dynamodb-and-logs"
  role   = aws_iam_role.counter.id
  policy = data.aws_iam_policy_document.counter.json
}

resource "aws_lambda_function" "counter" {
  function_name    = "${var.project}-visitor-counter"
  role             = aws_iam_role.counter.arn
  handler          = "handler.lambda_handler"
  runtime          = "python3.12"
  architectures    = ["arm64"]
  memory_size      = 128
  timeout          = 5
  filename         = data.archive_file.counter.output_path
  source_code_hash = data.archive_file.counter.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.counter.name
    }
  }

  depends_on = [aws_cloudwatch_log_group.counter]
}

resource "aws_apigatewayv2_api" "counter" {
  name          = "${var.project}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = concat(
      ["https://${aws_cloudfront_distribution.site.domain_name}"],
      [for d in local.aliases : "https://${d}"],
      var.extra_cors_origins,
    )
    allow_methods = ["POST"]
    allow_headers = ["content-type"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "counter" {
  api_id                 = aws_apigatewayv2_api.counter.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.counter.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "counter" {
  api_id    = aws_apigatewayv2_api.counter.id
  route_key = "POST /count"
  target    = "integrations/${aws_apigatewayv2_integration.counter.id}"
}

# Throttling keeps a public, unauthenticated endpoint cheap if someone hammers it
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.counter.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 5
  }
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowHttpApiInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.counter.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.counter.execution_arn}/*/*"
}
