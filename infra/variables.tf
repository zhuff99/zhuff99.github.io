variable "region" {
  description = "AWS region for the bucket, Lambda, DynamoDB, and API"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Name prefix for all resources"
  type        = string
  default     = "zach-portfolio"
}

variable "domain_name" {
  description = "Optional custom domain (e.g. zachhuff.com) with a Route 53 hosted zone. Leave empty to use the CloudFront URL."
  type        = string
  default     = ""
}

variable "include_www" {
  description = "Also serve www.<domain_name> when a custom domain is set"
  type        = bool
  default     = true
}

variable "github_repo" {
  description = "GitHub repository allowed to deploy, as owner/name"
  type        = string
  default     = "zhuff99/zhuff99.github.io"
}

variable "github_branch" {
  description = "Branch allowed to deploy"
  type        = string
  default     = "master"
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub Actions OIDC provider. Set false if your AWS account already has one."
  type        = bool
  default     = true
}

variable "extra_cors_origins" {
  description = "Additional origins allowed to call the visitor counter API"
  type        = list(string)
  default     = ["http://localhost:8420", "https://zhuff99.github.io"]
}
