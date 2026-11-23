import uuid
from datetime import datetime

from pydantic import Field, field_validator

from app.models.catalogue import Concentration, NotePosition
from app.schemas.common import ORM


class DataSourceOut(ORM):
    id: uuid.UUID
    name: str
    slug: str
    access_method: str
    licence: str
    redistribution_allowed: bool
    is_synthetic: bool


class FamilyOut(ORM):
    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None


class AccordOut(ORM):
    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None


class BrandSummary(ORM):
    id: uuid.UUID
    name: str
    slug: str
    country: str | None = None
    is_synthetic: bool
    last_verified_at: datetime | None = None


class BrandOut(BrandSummary):
    website: str | None = None
    perfume_count: int = 0


class PerfumerOut(ORM):
    id: uuid.UUID
    name: str
    slug: str
    bio: str | None = None
    is_synthetic: bool
    last_verified_at: datetime | None = None


class NoteOut(ORM):
    id: uuid.UUID
    name: str
    slug: str
    family: str
    tier: NotePosition | None = None
    description: str | None = None
    aliases: list[str] = Field(default_factory=list)

    @field_validator("aliases", mode="before")
    @classmethod
    def _alias_names(cls, v):
        return [a if isinstance(a, str) else a.alias for a in (v or [])]


class VariantOut(ORM):
    id: uuid.UUID
    concentration: Concentration
    volume_ml: float
    gtin: str | None = None
    edition: str = ""
    is_synthetic: bool


class PyramidNote(ORM):
    slug: str
    name: str
    family: str


class Pyramid(ORM):
    top: list[PyramidNote] = Field(default_factory=list)
    heart: list[PyramidNote] = Field(default_factory=list)
    base: list[PyramidNote] = Field(default_factory=list)


class PerfumeAccordOut(ORM):
    slug: str
    name: str
    strength: int = Field(description="Relative prominence 1–100 (editorial/source data, not a measurement)")


class PerfumeSummary(ORM):
    id: uuid.UUID
    name: str
    slug: str
    release_year: int | None = None
    brand: BrandSummary
    family: FamilyOut | None = None
    is_synthetic: bool
    last_verified_at: datetime | None = None


class PerfumeDetail(PerfumeSummary):
    description: str | None = None
    gender_positioning: str | None = None
    variants: list[VariantOut]
    notes: Pyramid
    accords: list[PerfumeAccordOut]
    perfumers: list[PerfumerOut]
    data_source: DataSourceOut | None = None


class BrandDetail(BrandOut):
    perfumes: list[PerfumeSummary]


class NoteDetail(NoteOut):
    perfumes: list[PerfumeSummary]


class AccordDetail(AccordOut):
    perfumes: list[PerfumeSummary]


class PerfumerDetail(PerfumerOut):
    perfumes: list[PerfumeSummary]


class SearchResults(ORM):
    query: str
    perfumes: list[PerfumeSummary]
    brands: list[BrandSummary]
    notes: list[NoteOut]
    perfumers: list[PerfumerOut]
