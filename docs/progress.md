# Progress

## Phase 0 — walking skeleton (awaiting approval)

Rebuilt from scratch with DevOps from day one; the previous codebase is reference material only.

**Verified here**
- API: 11 pytest tests pass against PostgreSQL 16 (migrations down/up each run); ruff clean.
- Web: production build, ESLint, `tsc`, Vitest pass; Playwright e2e passes (mobile + desktop, axe accessibility).
- Dockerfiles: hadolint clean; each image's build and runtime steps were run outside Docker and served correctly
  (migrations applied, `/health/ready`, `/api/v1/meta`, web streaming API status, static assets).
- Workflows: actionlint clean.
- Kubernetes: all three overlays render with Kustomize and validate with kubeconform `-strict` (incl. Gateway API,
  CloudNativePG, External Secrets and Argo CD schemas).

**Not verifiable here (no Docker daemon or cluster in this environment)**
- `docker build` / `docker compose up` themselves, the GitHub Actions run, and `make k8s-up` on kind. They run on
  first push / on a machine with Docker; any failure there is the first thing to fix in Phase 1.

**Next:** owner approval → Phase 1 (catalogue database & API).
