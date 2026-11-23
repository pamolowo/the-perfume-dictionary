from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db import get_db

router = APIRouter(tags=["system"])


class HealthOut(BaseModel):
    status: Literal["ok"]


class ReadyOut(BaseModel):
    status: Literal["ready"]
    database: Literal["ok"]
    migration: str | None


class NotReadyOut(BaseModel):
    status: Literal["not_ready"]
    database: Literal["unavailable"]


class MetaOut(BaseModel):
    name: str
    version: str
    git_sha: str
    environment: str


@router.get("/health", response_model=HealthOut, summary="Liveness: the process is up")
def health():
    return {"status": "ok"}


@router.get("/health/ready", response_model=ReadyOut, responses={503: {"model": NotReadyOut}},
            summary="Readiness: dependencies reachable and migrations applied")
def ready(db: Annotated[Session, Depends(get_db)]):
    try:
        db.execute(text("SELECT 1"))
        revision = db.execute(text("SELECT version_num FROM alembic_version")).scalar()
    except Exception:  # noqa: BLE001 - any DB failure means not ready
        return JSONResponse(status_code=503, content={"status": "not_ready", "database": "unavailable"})
    return {"status": "ready", "database": "ok", "migration": revision}


@router.get("/api/v1/meta", response_model=MetaOut, summary="What is running: version, commit and environment")
def meta(settings: Annotated[Settings, Depends(get_settings)]):
    return {"name": settings.app_name, "version": settings.app_version, "git_sha": settings.git_sha,
            "environment": settings.environment}
