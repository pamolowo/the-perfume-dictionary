"""Tests use a real PostgreSQL (TEST_DATABASE_URL), migrated with Alembic, the same way every environment is."""
import os

TEST_DB = os.environ.get("TEST_DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/perfume_test")
os.environ["DATABASE_URL"] = TEST_DB
os.environ.setdefault("APP_VERSION", "9.9.9-test")
os.environ.setdefault("GIT_SHA", "abc1234")
os.environ.setdefault("ENVIRONMENT", "ci")

from pathlib import Path  # noqa: E402

import pytest  # noqa: E402
from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]


def alembic_cfg() -> Config:
    cfg = Config(str(ROOT / "alembic.ini"))
    cfg.set_main_option("script_location", str(ROOT / "alembic"))
    cfg.set_main_option("sqlalchemy.url", TEST_DB)
    return cfg


@pytest.fixture(scope="session")
def migrated():
    cfg = alembic_cfg()
    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")
    yield


@pytest.fixture(scope="session")
def client(migrated):
    from app.core.config import get_settings

    get_settings.cache_clear()
    from app.main import create_app

    with TestClient(create_app()) as c:
        yield c
