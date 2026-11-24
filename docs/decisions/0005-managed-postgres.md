# 0005 — Managed PostgreSQL in cloud environments

Status: accepted. Provider: **AWS** (RDS PostgreSQL, eu-west-2) — owner decision 2026-11-23. Until then, Neon Free
(ADR 0007).

**Context.** Postgres is our only stateful component. Running it in-cluster in production means owning backups,
failover, upgrades and PITR.

**Decision.** On AWS, staging and production use Amazon RDS for PostgreSQL 16 (London, eu-west-2), with automated
backups and PITR. Locally we use a container (compose) or CloudNativePG (kind) for parity.

**Consequences.** Higher unit cost, far less operational risk. Connection string arrives via External Secrets.
