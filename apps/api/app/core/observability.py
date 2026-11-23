"""Request logging, request IDs and Prometheus metrics."""
import logging
import time
import uuid

from fastapi import FastAPI, Request
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from starlette.responses import Response

log = logging.getLogger("app.http")

REQUESTS = Counter("http_requests_total", "HTTP requests", ["method", "route", "status"])
LATENCY = Histogram("http_request_duration_seconds", "HTTP request latency", ["method", "route"],
                    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5))


def install(app: FastAPI) -> None:
    @app.middleware("http")
    async def observe(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or uuid.uuid4().hex
        start = time.perf_counter()
        status = 500
        try:
            response = await call_next(request)
            status = response.status_code
            response.headers["x-request-id"] = request_id
            return response
        finally:
            route = request.scope.get("route")
            template = getattr(route, "path", "unmatched")  # route template keeps metric cardinality low
            elapsed = time.perf_counter() - start
            if template != "/metrics":
                REQUESTS.labels(request.method, template, str(status)).inc()
                LATENCY.labels(request.method, template).observe(elapsed)
                log.info("request", extra={"method": request.method, "path": request.url.path, "status": status,
                                           "duration_ms": round(elapsed * 1000, 1), "request_id": request_id})

    @app.get("/metrics", include_in_schema=False)
    def metrics() -> Response:
        return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
