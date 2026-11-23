from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from environment variables (12-factor). See .env.example."""

    model_config = SettingsConfigDict(env_file=(".env", "../../.env"), extra="ignore")

    app_name: str = "The Perfume Dictionary API"
    environment: str = "local"  # local | ci | staging | production
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/perfume"
    cors_origins: list[str] = ["http://localhost:3000"]
    log_level: str = "INFO"
    # Injected at build/deploy time so every response can say exactly what is running.
    app_version: str = "0.0.0-dev"
    git_sha: str = "unknown"

    @field_validator("database_url")
    @classmethod
    def _psycopg_driver(cls, v: str) -> str:
        """Accept plain postgres URLs as issued by managed databases and the CloudNativePG operator."""
        for prefix in ("postgresql://", "postgres://"):
            if v.startswith(prefix):
                return "postgresql+psycopg://" + v[len(prefix):]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
