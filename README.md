# Zach Huff — Cloud Portfolio

[![CI](https://github.com/zhuff99/zhuff99.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/zhuff99/zhuff99.github.io/actions/workflows/ci.yml)

My personal portfolio site, and a cloud project in its own right: a static site served from a
private S3 bucket through CloudFront, with a serverless visitor counter. All infrastructure is
defined in Terraform and deployed through GitHub Actions using OIDC (no stored AWS keys).

## Architecture

```
                    ┌──────────────────────── AWS ─────────────────────────┐
 Browser ──HTTPS──▶ │ Route 53 + ACM ─▶ CloudFront ─(OAC)─▶ S3 (private)   │
    │               │                                                      │
    └──POST /count─▶│ API Gateway (HTTP, throttled) ─▶ Lambda ─▶ DynamoDB  │
                    └──────────────────────────────────────────────────────┘
 GitHub push ─▶ Actions ─(OIDC → scoped IAM role)─▶ s3 sync + CloudFront invalidation
```

| Concern | How it's handled |
|---|---|
| Hosting | S3 bucket with all public access blocked; only CloudFront can read it (Origin Access Control) |
| HTTPS & CDN | CloudFront with HTTP→HTTPS redirect, compression, AWS managed security-headers policy |
| Custom domain | Optional: ACM certificate (DNS-validated) and Route 53 A/AAAA alias records |
| Visitor counter | HTTP API → Python Lambda → DynamoDB atomic `ADD`; route throttling caps abuse |
| Least privilege | Lambda may only `UpdateItem` on one table; deploy role may only write one bucket and invalidate one distribution |
| CI/CD | GitHub OIDC federation; role trust restricted to this repo's `master` branch |
| Quality gates | Lambda unit tests, `terraform fmt` and `terraform validate` on every push |
| Cost | Pay-per-request everywhere; fits comfortably in the AWS free tier |

## Repository layout

```
index.html, styles.css, main.js   the site (no build step)
projects.js                        all site content: bio, skills, certifications, projects
backend/visitor_counter/           Lambda function (Python)
backend/tests/                     unit tests (standard library only)
infra/                             Terraform
.github/workflows/                 CI and deploy pipelines
```

## Editing content

Almost everything lives in **`projects.js`**: headline, bio, facts, certifications, skills, and
featured projects. Projects that aren't on GitHub use `repo: null`. "More on GitHub" loads live
from the GitHub API.

Run locally:

```bash
python -m http.server 8420
```

## Deploying to AWS

Prerequisites: an AWS account, the [AWS CLI](https://aws.amazon.com/cli/) signed in
(`aws configure` or `aws sso login`), and [Terraform](https://developer.hashicorp.com/terraform/install) ≥ 1.6.

1. **Create the infrastructure**

   ```bash
   cd infra
   cp terraform.tfvars.example terraform.tfvars   # optional: set a custom domain
   terraform init
   terraform apply
   ```

2. **Connect GitHub Actions.** In the repo, open *Settings → Secrets and variables → Actions → Variables*
   and add these from the `terraform output` values:

   | Variable | Terraform output |
   |---|---|
   | `AWS_DEPLOY_ROLE_ARN` | `github_deploy_role_arn` |
   | `SITE_BUCKET` | `site_bucket` |
   | `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` |
   | `AWS_REGION` | your region (optional, defaults to `us-east-1`) |

3. **Turn on the visitor counter.** Put `counter_api_url` into `counterApi` in `projects.js`.

4. **Push.** The deploy workflow uploads the site and invalidates the CDN cache. The site is live at
   the `site_url` output.

Until step 2 is done, the deploy workflow is skipped and the site is still served by GitHub Pages.

Tear everything down with `terraform destroy` (empty the S3 bucket first).
