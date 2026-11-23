# Common tasks. `make help` lists them.
.DEFAULT_GOAL := help
SHA := $(shell git rev-parse --short HEAD 2>/dev/null || echo dev)
export GIT_SHA := $(SHA)

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-14s\033[0m %s\n",$$1,$$2}'

## ── Local stack (Docker Compose) ───────────────────────────────
up: ## Build and start db → migrate → api → web  (http://localhost:3000)
	docker compose up --build -d
	@echo "Web: http://localhost:3000   API: http://localhost:8000/docs"
down: ## Stop the stack (keeps the database volume)
	docker compose down
reset: ## Stop the stack AND delete the local database volume
	docker compose down -v
logs: ## Follow logs from every service
	docker compose logs -f

## ── Development without Docker ─────────────────────────────────
install: ## Install API (venv) and web dependencies
	cd apps/api && python3 -m venv .venv && .venv/bin/pip install -e ".[dev]"
	npm ci
dev-api: ## Run the API with reload (needs Postgres and .env)
	cd apps/api && .venv/bin/alembic upgrade head && .venv/bin/uvicorn app.main:app --reload
dev-web: ## Run the website with hot reload
	npm run dev:web

## ── Quality gates (same as CI) ─────────────────────────────────
lint: ## Lint API, web, Dockerfiles and workflows
	cd apps/api && .venv/bin/ruff check app tests alembic
	npm run lint -w apps/web && npm run typecheck -w apps/web
	hadolint apps/api/Dockerfile apps/web/Dockerfile
	actionlint
test: ## Unit and integration tests (API needs TEST_DATABASE_URL)
	cd apps/api && .venv/bin/pytest
	npm test -w apps/web
e2e: ## Playwright against the running compose stack
	E2E_BASE_URL=http://localhost:3000 npm run e2e -w apps/web
api-types: ## Regenerate the typed API client from the OpenAPI schema
	npm run api:types

## ── Kubernetes ─────────────────────────────────────────────────
k8s-validate: ## Render every overlay and validate against schemas
	scripts/validate-manifests.sh
k8s-up: ## Create a kind cluster, install add-ons, deploy the local overlay
	scripts/k8s-local.sh up
k8s-deploy: ## Rebuild images and redeploy to the kind cluster
	scripts/k8s-local.sh deploy
k8s-down: ## Delete the kind cluster
	scripts/k8s-local.sh down

.PHONY: help up down reset logs install dev-api dev-web lint test e2e api-types k8s-validate k8s-up k8s-deploy k8s-down
