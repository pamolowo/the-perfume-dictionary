# Implementation roadmap — DevOps from day one, £0 until it earns

Every phase ends with the owner's approval. Each phase is done when:

> PR(s) with green CI · images built, scanned (signed on main) · runs in compose **and** on local kind ·
> from Phase 3: deployed to the free cloud preview with migrations first and a passing smoke test ·
> metrics/logs for anything new · docs and CHANGELOG updated · migrations expand/contract-safe.

Hosting path (ADR 0007): **local** (compose, kind) → **free cloud** (Vercel Hobby + Neon Free at
`perfume.pambydesign.net`) → **AWS** (EKS + RDS, London) when the product needs scale or earns money.

| # | Phase | Product scope | DevOps scope |
|---|---|---|---|
| 0 | Foundation ✅ v0.1.0 | Web → API → DB skeleton, build identity on the page | Monorepo, Dockerfiles, compose, CI, image build/sign, CodeQL, Dependabot, Kustomize + kind, Argo CD apps, ADRs |
| 1 | Catalogue database & API ✅ v0.2.0 | Brands, perfumers, notes (+aliases), accords, families, perfumes, variants; filters, cursor pagination, accent-/typo-tolerant search; synthetic seed | Migration up/down/up + drift check in CI, integrity tests, seed as compose service and kind Job (never production), packaging check |
| **2** | **Website** ✅ in review | Home, perfume/brand/note/accord pages, search UI, SEO, accessibility | Lighthouse budgets in CI, e2e + axe for every page type, request-time sitemap/robots, security-finding triage |
| 3 | **Free cloud preview** | Public preview at `perfume.pambydesign.net` | Neon project + branches per PR; two Vercel projects; GitHub Actions deploy (migrate → deploy → smoke → promote); DNS at Squarespace; uptime check; Vercel/Neon env secrets via GitHub Environments; runbooks |
| 4 | AI Mixer | Blend perfumes, predicted scent profile (virtual weights, clearly labelled predictions) | Model/config versioning, evaluation job with regression threshold, feature flag |
| 5 | Similar Perfumes (ADR 0006) | Similar scent profile from notes/accords with score, model version, confidence | Feature flag off publicly until legal sign-off; offline evaluation |
| 6 | Accounts & community | Sign-in, collections, reviews, votes, moderation | Auth provider (free tier), rate limiting, GDPR export/delete |
| 7 | Price comparison | Per-country prices with discounts, charts, provenance | Scheduled ingestion (GitHub Actions cron / Vercel cron), source-permission registry, freshness alerts. **Commercial → leaves Vercel Hobby** |
| 8 | AWS move (when needed) | — | Terraform (VPC, EKS, RDS, Route 53 or Squarespace DNS, OIDC), Argo CD, Envoy Gateway, cert-manager, External Secrets, Prometheus/Grafana/Loki; staging auto-sync, production manual |
| 9 | Data pipelines & workers | Imports, enrichment, de-duplication | Queue, workers, job dashboards, dead-letter handling |
| 10 | Admin / CMS | Editorial tools, approvals, audit log | SSO for admin, RBAC tests |
| 11 | Developer API | API keys, quotas, docs portal | Per-key rate limits, usage metering, status page |
| 12 | Production hardening & launch | Legal pages, consent, performance | HA Postgres + PITR drills, canary releases, signature admission policy, load tests, DR plan, security review |
| 13 | Advanced AI | Recommendations, grounded LLM explanations | Model serving, cost/latency budgets, evaluation gates |

## Decisions still open
- ~~GitHub repository~~ → `github.com/pamolowo/the-perfume-dictionary`, images at `ghcr.io/pamolowo/perfume-*`.
- When to move from free tiers (trigger: monetisation in Phase 7, or limits reached).
