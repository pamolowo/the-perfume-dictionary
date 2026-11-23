# Contributing

## Branching — trunk-based
- `main` is always deployable. It is protected: PR required, CI green, 1 review, linear history (squash merge).
- Branch from `main`, keep branches short-lived (≤ 2 days): `feat/catalogue-search`, `fix/ready-probe`, `chore/deps`.
- Unfinished features hide behind a flag rather than living on a long branch.

## Commits — Conventional Commits
`feat(api): add perfume search endpoint`, `fix(web): …`, `chore(deps): …`, `ci: …`, `docs: …`, `refactor: …`,
`test: …`, `build: …`. A `!` or `BREAKING CHANGE:` footer marks breaking changes. The squash-merge title must follow
this format; it feeds the changelog.

## Before opening a PR
```bash
make lint test      # same checks as CI
make up && make e2e # if you touched anything user-visible or the containers
make api-types      # if you changed the API schema — commit the result
make k8s-validate   # if you touched deploy/
```

## Database migrations — expand / migrate / contract
New code and old code run side by side during a rolling deploy, and migrations run *before* new pods start. So every
migration must work with the release currently in production:
1. **Expand** — add nullable columns/new tables; never rename or drop in the same release.
2. **Migrate** — backfill data; switch code to the new shape.
3. **Contract** — drop the old column/table in a *later* release.
Destructive migrations need owner approval and a tested downgrade.

## Releases
1. Merge to `main` → images `sha-<short>` built, signed, deployed to staging automatically (from Phase 3).
2. When staging is good: update `CHANGELOG.md`, tag `vX.Y.Z` (SemVer) → release images built.
3. Open a PR bumping `deploy/k8s/overlays/production` to the release tag. After merge, sync production in Argo CD.
4. Rollback = revert that PR (or `argocd app rollback`). Images are immutable, so rollbacks are exact.
