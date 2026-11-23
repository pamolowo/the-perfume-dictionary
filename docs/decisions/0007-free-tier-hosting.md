# 0007 — Free-tier hosting first (Vercel + Neon), AWS later

Status: accepted (owner decision, 2026-11-23)

**Context.** The owner wants no running costs until the product needs them. The site is a Next.js app that renders on
the server and calls a FastAPI service backed by PostgreSQL, so it needs compute and a database — static hosting
alone cannot run it. The owner has the domain `pambydesign.net` (registered with Google Domains, now managed by
Squarespace Domains).

**Options considered.**
- *GitHub Pages* — free, but static files only: no server rendering, no API, no database. Rejected for the app
  (could host a static docs site later).
- *Vercel Hobby + Neon Free* — Vercel runs Next.js natively and FastAPI as Python functions; Neon Free gives
  serverless Postgres (1 GB per project, 100 CU-hours/month, scale-to-zero, no card). Custom domains and TLS are free.
- *AWS (EKS + RDS)* — the long-term target (ADR 0005), but a cluster alone costs money every hour.

**Decision.**
1. Everyday development stays **local**: Docker Compose and the kind Kubernetes cluster (both free).
2. The first public environment (Phase 3) is **Vercel Hobby + Neon Free** at `perfume.pambydesign.net`
   (web) and `api.perfume.pambydesign.net` (API). Two Vercel projects from this monorepo (`apps/web`, `apps/api`).
3. Deploys run from **GitHub Actions** (not Vercel's auto-deploy), so the DevOps order is kept:
   CI green → `alembic upgrade head` against Neon → `vercel deploy --prebuilt` → smoke test → promote.
   Pull requests get a preview deployment plus a throwaway **Neon branch** of the database.
4. The API runs with `DB_POOLING=none` against Neon's pooled (`-pooler`) connection string, because serverless
   instances must not hold their own connection pools.
5. **AWS** (London, eu-west-2) stays the target for production scale. The Dockerfiles, Kubernetes manifests and
   Argo CD setup are kept and tested in CI, so the move is a deployment change, not a rewrite.

**Limits to watch.**
- Vercel Hobby is for **personal, non-commercial** use. Before adding affiliate links, ads or anything that earns
  money (Phase 7 price comparison), move the web/API to Vercel Pro or to AWS.
- Neon Free: 1 GB storage per project; compute suspends if the monthly allowance is used up (no surprise bills).
- Free tiers change; re-check limits before launch.

**Consequences.** £0/month until monetisation. Two deployment targets to maintain (serverless and containers); CI keeps
both green.
