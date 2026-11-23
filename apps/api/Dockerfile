# syntax=docker/dockerfile:1.7
# The Perfume Dictionary API image. Build context: apps/api.
# Migrations never run on start: the deploy runs `alembic upgrade head` as a one-off job before new pods roll out.

FROM python:3.12-slim AS build
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /src
RUN python -m venv /venv
COPY pyproject.toml ./
COPY app ./app
RUN /venv/bin/pip install .

FROM python:3.12-slim AS runtime
ARG APP_VERSION=0.0.0-dev
ARG GIT_SHA=unknown
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PATH="/venv/bin:$PATH" \
    APP_VERSION=${APP_VERSION} GIT_SHA=${GIT_SHA}
LABEL org.opencontainers.image.title="perfume-api" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}"
RUN useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin app
WORKDIR /app
COPY --from=build /venv /venv
COPY alembic.ini ./
COPY alembic ./alembic
USER 10001
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s \
  CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*", "--no-access-log"]
