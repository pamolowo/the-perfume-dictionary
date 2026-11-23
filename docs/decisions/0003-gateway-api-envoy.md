# 0003 — Gateway API with Envoy Gateway for ingress

Status: accepted (Phase 0)

**Context.** ingress-nginx was retired in March 2026. Gateway API is the Kubernetes standard successor to Ingress.

**Decision.** Use Gateway API resources (Gateway, HTTPRoute) with Envoy Gateway as the implementation; cert-manager
issues certificates for Gateway listeners.

**Consequences.** Portable routing (other implementations or a cloud provider's gateway can replace Envoy Gateway
without changing HTTPRoutes).
