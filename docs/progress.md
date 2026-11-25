# Progress

## Phase 2 — website (awaiting approval)

**Verified here:** 22 unit tests; 26 Playwright runs (13 scenarios × mobile/desktop) with axe, run twice; Lighthouse on
8 page types — accessibility 100, best practices 100, performance 80–100; production build; the web image's
build and runtime steps rehearsed from exactly the files to be committed and run as UID 10001; 57 API tests;
manifests (incl. the new image-tag guard) and workflows valid; Trivy misconfiguration scan 0 findings; npm audit
and pip-audit clean.

**Not verifiable here:** the GitHub Actions run itself (first run of the Lighthouse step on GitHub's Chrome).

**Next:** owner approval → Phase 3 (free cloud preview at perfume.pambydesign.net).


## Phase 1 — catalogue database & API ✅ released v0.2.0 (2026-11-25)

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
