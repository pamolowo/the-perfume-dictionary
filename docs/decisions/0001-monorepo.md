# 0001 — Monorepo with npm workspaces

Status: accepted (Phase 0)

**Context.** One small team; the website depends on the API's schema; one pipeline should test them together.

**Decision.** Single repository: `apps/api`, `apps/web`, `packages/api-client`, `deploy`, `infrastructure`.
The typed client is generated from the API's OpenAPI schema and CI fails if it drifts.

**Consequences.** Atomic cross-cutting changes and one CI. Images still build and deploy independently. If the team
grows, path filters keep CI fast.
