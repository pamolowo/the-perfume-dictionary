#!/usr/bin/env bash
# Local Kubernetes: creates a kind cluster, installs the platform add-ons (Gateway API, Envoy Gateway, CloudNativePG),
# builds and loads both images, runs migrations, deploys the local overlay and port-forwards the gateway.
# Needs: docker, kind, kubectl. Usage: scripts/k8s-local.sh up | deploy | down
set -euo pipefail
cd "$(dirname "$0")/.."

GATEWAY_API=v1.7.0
ENVOY_GATEWAY=v1.10.0
CNPG=1.30.2
CLUSTER=perfume
NS=perfume
SHA=$(git rev-parse --short HEAD 2>/dev/null || echo dev)

platform() {
  kind get clusters | grep -qx "$CLUSTER" || kind create cluster --config deploy/local/kind-config.yaml
  kubectl apply --server-side -f "https://github.com/kubernetes-sigs/gateway-api/releases/download/${GATEWAY_API}/standard-install.yaml"
  kubectl apply --server-side -f "https://github.com/envoyproxy/gateway/releases/download/${ENVOY_GATEWAY}/install.yaml"
  kubectl apply --server-side -f "https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-${CNPG%.*}/releases/cnpg-${CNPG}.yaml"
  kubectl -n envoy-gateway-system wait --for=condition=Available deployment/envoy-gateway --timeout=300s
  kubectl -n cnpg-system wait --for=condition=Available deployment/cnpg-controller-manager --timeout=300s
}

images() {
  docker build -t perfume-api:local --build-arg APP_VERSION=0.0.0-local --build-arg GIT_SHA="$SHA" apps/api
  docker build -t perfume-web:local -f apps/web/Dockerfile --build-arg APP_VERSION=0.0.0-local --build-arg GIT_SHA="$SHA" .
  kind load docker-image perfume-api:local perfume-web:local --name "$CLUSTER"
}

deploy() {
  images
  local manifests; manifests=$(kustomize build deploy/k8s/overlays/local 2>/dev/null || kubectl kustomize deploy/k8s/overlays/local)
  # 1) namespace + database first, 2) migrations, 3) everything else — the same order Argo CD's PreSync hook gives.
  echo "$manifests" | kubectl apply -f - --selector='app.kubernetes.io/component!=migration'
  kubectl -n "$NS" wait --for=condition=Ready cluster.postgresql.cnpg.io/perfume-db --timeout=300s
  kubectl -n "$NS" delete job perfume-migrate perfume-seed --ignore-not-found
  echo "$manifests" | kubectl apply -f - --selector='app.kubernetes.io/name=perfume-migrate'
  kubectl -n "$NS" wait --for=condition=Complete job/perfume-migrate --timeout=300s
  echo "$manifests" | kubectl apply -f -
  kubectl -n "$NS" wait --for=condition=Complete job/perfume-seed --timeout=300s
  kubectl -n "$NS" rollout restart deployment/perfume-api deployment/perfume-web
  kubectl -n "$NS" rollout status deployment/perfume-api --timeout=300s
  kubectl -n "$NS" rollout status deployment/perfume-web --timeout=300s
  local svc; svc=$(kubectl -n envoy-gateway-system get svc \
    -l "gateway.envoyproxy.io/owning-gateway-namespace=${NS},gateway.envoyproxy.io/owning-gateway-name=perfume" -o name)
  echo
  echo "Ready. In another terminal:  kubectl -n envoy-gateway-system port-forward ${svc} 8080:80"
  echo "Then open http://perfume.localhost:8080  (API: http://api.perfume.localhost:8080/api/v1/meta)"
}

case "${1:-up}" in
  up) platform; deploy ;;
  deploy) deploy ;;
  down) kind delete cluster --name "$CLUSTER" ;;
  *) echo "usage: $0 up|deploy|down" >&2; exit 2 ;;
esac
