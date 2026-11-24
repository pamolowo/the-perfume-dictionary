# Infrastructure (Terraform)

Nothing is provisioned yet, deliberately (ADR 0007: no running costs until needed).

**Phase 3 — free cloud preview:** Vercel + Neon are configured with their CLIs from GitHub Actions; no Terraform yet
(both have Terraform providers, which we may adopt then to keep settings in code).

**Phase 8 — AWS (owner decision: AWS, London eu-west-2):**
```
infrastructure/terraform/
  bootstrap/                  # S3 state bucket + DynamoDB lock, GitHub OIDC role (no long-lived keys)
  modules/{network,eks,rds,dns,observability}
  envs/{staging,production}/  # backend, providers, module calls, tfvars
```
| Need | AWS service |
|---|---|
| Kubernetes | EKS (managed node group or Fargate) |
| Postgres | RDS for PostgreSQL 16, Multi-AZ in production, PITR |
| Secrets | Secrets Manager → External Secrets |
| Registry | GHCR (keep) or ECR |
| DNS | Squarespace Domains (current) or Route 53 |

Pipeline: `fmt`/`validate`/`tflint`/`trivy config` on PRs, `plan` as a PR comment, `apply` after merge (staging) and
with manual approval via a GitHub Environment (production). Set AWS Budgets alerts before the first `apply`.
