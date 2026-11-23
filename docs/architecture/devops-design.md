# DevOps design

## Environments

| | local (compose) | local (kind) | staging | production |
|---|---|---|---|---|
| Purpose | daily dev | test k8s manifests | every merge to `main` | released versions |
| Database | postgres container | CloudNativePG | managed Postgres | managed Postgres (HA, PITR) |
| Images | built locally | built locally, `kind load` | `ghcr.io/…:sha-<short>` | `ghcr.io/…:X.Y.Z` |
| Deploy | `make up` | `make k8s-up` | Argo CD, automatic | Argo CD, manual sync |
| Secrets | `.env` | CNPG-generated | External Secrets ← cloud secret manager | same |
| TLS | none | none | cert-manager (Let's Encrypt staging) | cert-manager |

## Pipeline

**`ci.yml` (every PR and push to main)**
- `api`: ruff, pytest against a real Postgres service (migrations down/up).
- `web`: regenerate API client and fail on drift, ESLint, `tsc`, Vitest, production build.
- `containers`: hadolint, build both images via compose, start db → migrate → api → web, Playwright e2e against
  the real images, Trivy image scan (fail on fixable CRITICAL).
- `manifests`: render every Kustomize overlay, validate with kubeconform (+ CRD schemas).
- `security`: Trivy filesystem scan (deps, secrets, IaC misconfig) → GitHub code scanning.

**`codeql.yml`** — static analysis for Python and TypeScript (PRs, main, weekly).

**`build.yml` (main and `v*` tags)** — buildx with GitHub cache → push to GHCR with tags `sha-<short>`, `edge` (main)
or `X.Y.Z` (tags) → SBOM + provenance attestations → Trivy scan of the pushed digest → cosign keyless signature.

**Dependabot** — weekly PRs for pip, npm, Docker base images and Actions.

## Delivery (from Phase 3)
- Staging: after `build.yml` on main, a job updates `deploy/k8s/overlays/staging` `newTag` to `sha-<short>` and
  commits; Argo CD auto-syncs. The migration Job runs first as a PreSync hook, then pods roll (`maxUnavailable: 0`).
  A post-deploy smoke test hits `/health/ready` and `/api/v1/meta` and checks the git SHA.
- Production: release tag → PR bumping the production overlay → review → merge → manual Argo CD sync → smoke test.
  Later: Argo Rollouts canary with automated analysis on error rate and latency.

## Rollback
Revert the overlay commit (or `argocd app rollback perfume-<env> <id>`). Because migrations are expand/contract, the
previous release still works against the migrated schema. Database restore (PITR) is a last resort, in the runbook.

## Security baseline
Non-root numeric UIDs, read-only root filesystem, all capabilities dropped, seccomp RuntimeDefault, namespaces
enforce Pod Security "restricted", default-deny ingress NetworkPolicies, no service-account tokens mounted, signed
images (cosign verification policy at admission from Phase 11), SBOMs, secret scanning, pinned Action SHAs, least
privilege workflow permissions.

## Observability
- Metrics: `http_requests_total`, `http_request_duration_seconds` (route-template labels) at `/metrics`; scraped
  by Prometheus (kube-prometheus-stack) from Phase 3.
- Logs: one JSON line per request with `request_id`; shipped by Grafana Alloy to Loki.
- Traces: OpenTelemetry SDK + collector, added in Phase 3.
- SLOs (initial): API availability 99.5 %, p95 latency < 300 ms for catalogue reads; alerts on burn rate.

## Versioning
SemVer tags `vX.Y.Z`. The API reports `version` and `git_sha` at `/api/v1/meta` (baked in at build time), and the
web home page shows them — so anyone can see exactly which build is live.
