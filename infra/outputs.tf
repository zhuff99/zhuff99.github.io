output "site_url" {
  description = "Where the site is served"
  value       = local.use_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "counter_api_url" {
  description = "Paste into SITE.counterApi in projects.js"
  value       = "${aws_apigatewayv2_api.counter.api_endpoint}/count"
}

output "site_bucket" {
  description = "GitHub repo variable SITE_BUCKET"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "GitHub repo variable CLOUDFRONT_DISTRIBUTION_ID"
  value       = aws_cloudfront_distribution.site.id
}

output "github_deploy_role_arn" {
  description = "GitHub repo variable AWS_DEPLOY_ROLE_ARN"
  value       = aws_iam_role.github_deploy.arn
}
