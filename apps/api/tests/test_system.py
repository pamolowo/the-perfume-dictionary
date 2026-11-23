import json
import logging

import pytest

from app.core.config import Settings
from app.core.logging import JsonFormatter


def test_liveness(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_readiness_reports_database_and_migration(client):
    r = client.get("/health/ready")
    assert r.status_code == 200
    assert r.json() == {"status": "ready", "database": "ok", "migration": "0000"}


def test_meta_reports_build_identity(client):
    assert client.get("/api/v1/meta").json() == {
        "name": "The Perfume Dictionary API", "version": "9.9.9-test", "git_sha": "abc1234", "environment": "ci"}


def test_request_id_is_returned_or_propagated(client):
    assert len(client.get("/health").headers["x-request-id"]) == 32
    assert client.get("/health", headers={"x-request-id": "trace-me"}).headers["x-request-id"] == "trace-me"


def test_metrics_count_requests_by_route_template(client):
    client.get("/api/v1/meta")
    body = client.get("/metrics").text
    assert 'http_requests_total{method="GET",route="/api/v1/meta",status="200"}' in body
    assert "http_request_duration_seconds_bucket" in body
    assert 'route="/metrics"' not in body  # scrapes don't count themselves


def test_unknown_routes_do_not_explode_metric_cardinality(client):
    client.get("/nope/12345")
    assert 'route="unmatched"' in client.get("/metrics").text


def test_logs_are_single_line_json():
    rec = logging.LogRecord("app.http", logging.INFO, __file__, 1, "request", None, None)
    rec.status, rec.path = 200, "/health"
    out = json.loads(JsonFormatter().format(rec))
    assert out["msg"] == "request" and out["status"] == 200 and out["level"] == "info"


@pytest.mark.parametrize("url,expected", [
    ("postgresql://u:p@h:5432/db", "postgresql+psycopg://u:p@h:5432/db"),
    ("postgres://u:p@h/db?sslmode=require", "postgresql+psycopg://u:p@h/db?sslmode=require"),
    ("postgresql+psycopg://u:p@h/db", "postgresql+psycopg://u:p@h/db"),
])
def test_database_url_accepts_plain_postgres_urls(url, expected):
    assert Settings(database_url=url).database_url == expected


def test_readiness_fails_closed_when_database_is_down(monkeypatch, client):
    from app.db import get_db
    from app.main import app as default_app  # noqa: F401  (import side effects already applied)

    class Broken:
        def execute(self, *_):
            raise RuntimeError("db down")

    client.app.dependency_overrides[get_db] = lambda: Broken()
    try:
        r = client.get("/health/ready")
        assert r.status_code == 503 and r.json()["status"] == "not_ready"
    finally:
        client.app.dependency_overrides.clear()
