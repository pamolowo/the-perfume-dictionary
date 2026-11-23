# Progress

## Phase 1 — catalogue database & API (awaiting approval)

**Verified here**
- 57 API tests pass against PostgreSQL 16: endpoints, filters, pagination across all sorts, search (accents, typos,
  aliases, LIKE-wildcard escaping), error schema, validation, metrics labels, check/FK constraints, cascade rules,
  seed idempotency and its production guard, migration/model drift.
- Migration 0001 goes up → down → up cleanly; `alembic check` reports no drift; search uses the trigram index
  (verified with EXPLAIN).
- The installed package (as built in the image) contains the reference data; migrate + seed ran from it outside
  the source tree.
- Typed client regenerated; web lint, typecheck, unit tests, build and e2e pass against a seeded API.
- Workflows pass actionlint; all Kustomize overlays (now with the seed Job locally and `perfume.pambydesign.net`
  hostnames for cloud) validate with kubeconform.

**Not verifiable here (no Docker daemon or cluster):** `docker compose up`, the GitHub Actions run and `make k8s-up`.

**Decisions recorded:** AWS as the eventual cloud (ADR 0005), free-tier hosting first (ADR 0007), Similar Perfumes
instead of Dupes (ADR 0006), domain `pambydesign.net` → `perfume.` / `api.perfume.` subdomains.

**Next:** owner approval → Phase 2 (website pages for the catalogue).

## Phase 0 — walking skeleton ✅ approved 2026-11-23
