"""Baseline: empty schema. Proves the migration job runs in every environment before any feature tables exist.

Revision ID: 0000
Revises:
Create Date: 2026-11-23
"""
from collections.abc import Sequence

revision: str = "0000"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
