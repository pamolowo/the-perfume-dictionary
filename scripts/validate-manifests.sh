#!/usr/bin/env bash
# Renders every Kustomize overlay and validates it against Kubernetes + CRD schemas (Gateway API, CloudNativePG,
# External Secrets, Argo CD). Used by CI and `make k8s-validate`.
set -euo pipefail
cd "$(dirname "$0")/.."
CRDS='https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
status=0
for overlay in deploy/k8s/overlays/*/; do
  name=$(basename "$overlay")
  echo "── ${name}"
  kustomize build "$overlay" | kubeconform -strict -summary -kubernetes-version 1.34.0 \
    -schema-location default -schema-location "$CRDS" - || status=1
done
# Guard: every environment must deploy the images it pins — exact tags in the cloud, locally built ones on kind.
echo "── image tags"
check_images() {  # overlay, regex every image must match
  local bad
  bad=$(kustomize build "deploy/k8s/overlays/$1" | sed -n 's/^ *image: *//p' | grep -vE "$2" || true)
  if [ -n "$bad" ]; then echo "  ✗ $1 deploys unexpected image(s): $bad"; status=1; else echo "  ✓ $1"; fi
}
check_images local '^perfume-(api|web):local$'
check_images staging '^ghcr\.io/[a-z0-9-]+/perfume-(api|web):(sha-[0-9a-f]{7,}|[0-9]+\.[0-9]+\.[0-9]+)$'
check_images production '^ghcr\.io/[a-z0-9-]+/perfume-(api|web):(sha-[0-9a-f]{7,}|[0-9]+\.[0-9]+\.[0-9]+)$'

echo "── argocd applications"
kubeconform -strict -summary -schema-location default -schema-location "$CRDS" deploy/argocd/*.yaml || status=1
exit $status
