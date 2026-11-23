"""Importing this package registers every model on Base.metadata (Alembic autogenerate relies on it)."""
from app.models.catalogue import (
    Accord,
    Brand,
    Concentration,
    DataSource,
    FragranceFamily,
    Note,
    NoteAlias,
    NotePosition,
    Perfume,
    PerfumeAccord,
    PerfumeNote,
    PerfumePerfumer,
    Perfumer,
    PerfumeVariant,
)

__all__ = [
    "Accord", "Brand", "Concentration", "DataSource", "FragranceFamily", "Note", "NoteAlias", "NotePosition",
    "Perfume", "PerfumeAccord", "PerfumeNote", "PerfumePerfumer", "Perfumer", "PerfumeVariant",
]
