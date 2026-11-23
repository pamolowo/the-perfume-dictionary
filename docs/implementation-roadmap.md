# Implementation roadmap — DevOps from day one

Every phase ends with the owner's approval. From Phase 3 on, every phase also meets the **standard definition of
done**:

> PR(s) with green CI · images built, scanned and signed · auto-deployed to staging · smoke tests pass ·
> metrics/dashboards and alerts for anything new · runbook for anything new that can break · docs and CHANGELOG
> updated · migrations expand/contract-safe.

Before Phase 3 (no cloud yet), "deployed" means: runs in compose **and** on the local kind cluster.

| # | Phase | Product scope | DevOps scope |
|---|---|---|---|
| **0** | **Foundation / walking skeleton** ✅ in review | Web → API → DB "hello", version shown on the page | Monorepo, Dockerfiles, compose, CI, image build/sign, CodeQL, Dependabot, Kustomize base + overlays, kind, Argo CD apps, ADRs |
| 1 | Catalogue database & API | Brands, perfumes, notes, accords, perfumers; search; seed data (synthetic, marked) | Migration tests in CI, API contract tests, seed Job, DB backup/restore script for local, OpenAPI published as CI artifact |
| 2 | Website | Home, perfume/brand/note pages, search, SEO, accessibility | Lighthouse CI budgets, visual smoke in e2e, image caching headers, HPA tuning on kind |
| 3 | **Cloud staging & continuous delivery** | — (deploy what exists) | Cloud decision; Terraform (network, cluster, managed Postgres, DNS, OIDC); Argo CD, Envoy Gateway, cert-manager, External Secrets; auto tag-bump to staging; smoke tests; Prometheus/Grafana/Loki/Alloy, OpenTelemetry; first SLOs and alerts; runbooks |
| 4 | AI Mixer | Blend perfumes, predicted scent profile (virtual weights, labelled predictions) | Model/config versioning, evaluation job in CI with regression threshold, feature flag, per-endpoint latency SLO |
| 5 | Similar Perfumes (legal gate, ADR 0006) | Factual similarity with score, model version, confidence | Feature flag off in production until sign-off; offline evaluation pipeline |
| 6 | Accounts & community | Sign-in, collections, reviews, votes, moderation | Auth provider integration, rate limiting at the gateway, abuse metrics, data-retention jobs, GDPR export/delete |
| 7 | Price comparison | Per-country prices with discounts, charts, provenance | Worker deployment, scheduled ingestion (CronJobs), source-permission registry, freshness alerts |
| 8 | Data pipelines & workers | Imports, enrichment, de-duplication | Queue (Redis), worker autoscaling, job dashboards, dead-letter handling |
| 9 | Admin / CMS | Editorial tools, approvals, audit log | Separate admin route + SSO, audit-log retention, RBAC tests |
| 10 | Developer API | API keys, quotas, docs portal | Key management, per-key rate limits, usage metering, public status page |
| 11 | Production hardening & launch | Legal pages, consent, performance | Production environment via Terraform, HA Postgres + PITR drills, canary releases (Argo Rollouts), image-signature admission policy, load tests, DR plan, security review/pen test, on-call |
| 12 | Advanced AI | Recommendations, LLM explanations (grounded, deterministic fallback) | Model serving, cost and latency budgets, evaluation gates, prompt/version tracking |

## Decisions still open
- Cloud provider (needed at the start of Phase 3).
- Phase 5 framing: "Similar Perfumes" vs "Dupes"/"Inspired by" — needs owner decision and legal advice (ADR 0006).
- GitHub repository name/owner (manifests use the placeholder `OWNER`).
