# Changelog

All notable changes are recorded here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Added — Phase 0: walking skeleton and delivery pipeline
- API skeleton: `/health`, `/health/ready` (database + migration revision), `/api/v1/meta`, `/metrics`; JSON logs
  with request IDs; Alembic baseline; 11 tests.
- Website skeleton: home page showing live API status; `/healthz`; Vitest and Playwright (mobile + desktop, axe).
- Typed API client generated from OpenAPI.
- Dockerfiles (multi-stage, non-root) and Docker Compose stack (db → migrate → api → web).
- GitHub Actions: CI, image build/scan/SBOM/sign to GHCR, CodeQL, Dependabot.
- Kubernetes: Kustomize base and local/staging/production overlays, Gateway API routing, network policies,
  migration Job as Argo CD PreSync hook, Argo CD Applications, kind-based local cluster.
- Docs: architecture, DevOps design, ADRs 0001–0006, roadmap.
