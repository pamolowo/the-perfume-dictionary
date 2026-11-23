# 0004 — GitOps with Argo CD

Status: accepted (Phase 0; live from Phase 3)

**Context.** We want every environment change reviewed, auditable and reversible, and no CI credentials with
cluster-admin.

**Decision.** Argo CD in each cluster pulls `deploy/k8s/overlays/<env>` from Git. CI only builds images and commits
tag bumps. Staging syncs automatically; production syncs manually after a reviewed PR. Migrations run as a PreSync
hook Job.

**Consequences.** Git history is the deploy log; rollback is a revert. Drift is detected and corrected (self-heal).
