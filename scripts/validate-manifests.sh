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
echo "── argocd applications"
kubeconform -strict -summary -schema-location default -schema-location "$CRDS" deploy/argocd/*.yaml || status=1
exit $status
