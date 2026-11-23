# Runbooks

Operational procedures. Each runbook: symptoms → checks → fix → verification → follow-up.

Planned (written as the matching capability goes live):
- `deploy-and-rollback.md` — Phase 3
- `api-not-ready.md` (readiness failing: database, migrations) — Phase 3
- `failed-migration.md` — Phase 3
- `database-restore-pitr.md` — Phase 3
- `certificate-renewal.md` — Phase 3
- `high-error-rate.md` / `high-latency.md` (linked from alerts) — Phase 3
- `rotate-secrets.md` — Phase 11
- `incident-response.md` — Phase 11

Until then: `docker compose logs <service>` locally; `kubectl -n perfume logs deploy/perfume-api` on kind.
