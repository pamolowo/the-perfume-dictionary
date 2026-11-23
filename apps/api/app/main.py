from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import observability
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.routers import system


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)
    app = FastAPI(title=settings.app_name, version=settings.app_version)
    app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_methods=["GET", "POST"],
                       allow_headers=["*"])
    observability.install(app)
    app.include_router(system.router)
    return app


app = create_app()
