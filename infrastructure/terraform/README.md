# Infrastructure (Terraform) — Phase 3

Nothing is provisioned yet. Phase 3 starts with one owner decision: **which cloud** (all three work; London regions):

| | AWS (eu-west-2) | Google Cloud (europe-west2) | Azure (uksouth) |
|---|---|---|---|
| Kubernetes | EKS | GKE Autopilot | AKS |
| Postgres | RDS / Aurora | Cloud SQL | Flexible Server |
| Secrets | Secrets Manager | Secret Manager | Key Vault |
| DNS | Route 53 | Cloud DNS | Azure DNS |

Planned layout:
```
infrastructure/terraform/
  modules/{network,cluster,database,dns,registry-access,observability}
  envs/{staging,production}/   # each: backend (remote state + locking), providers, module calls, tfvars
  bootstrap/                   # state bucket, CI OIDC role (no long-lived keys)
```
Pipeline: `terraform fmt/validate/tflint/trivy config` on PRs, `plan` posted as a PR comment, `apply` after merge
for staging and with manual approval (GitHub Environment) for production. Cluster add-ons (Argo CD, Envoy Gateway,
cert-manager, External Secrets, kube-prometheus-stack) are bootstrapped by Terraform once, then managed by Argo CD.
