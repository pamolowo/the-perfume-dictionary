# 0002 — Kustomize for Kubernetes manifests

Status: accepted (Phase 0)

**Context.** We deploy our own two services to three environments. Helm adds templating and a release store we do
not need for first-party apps.

**Decision.** Plain YAML base + per-environment overlays with Kustomize (built into kubectl and Argo CD). Third-party
add-ons (Envoy Gateway, CNPG, cert-manager, kube-prometheus-stack) are installed from their own releases/charts.

**Consequences.** Manifests are readable and diffable; no template logic. Overlays use JSON patches for differences.
