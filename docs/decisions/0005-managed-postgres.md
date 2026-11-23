# 0005 — Managed PostgreSQL in cloud environments

Status: accepted (Phase 0); provider chosen in Phase 3

**Context.** Postgres is our only stateful component. Running it in-cluster in production means owning backups,
failover, upgrades and PITR.

**Decision.** Staging and production use the cloud provider's managed PostgreSQL 16 (London region), with automated
backups and PITR. Locally we use a container (compose) or CloudNativePG (kind) for parity.

**Consequences.** Higher unit cost, far less operational risk. Connection string arrives via External Secrets.
