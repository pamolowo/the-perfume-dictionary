"""Catalogue models. Every catalogue row carries provenance: which data source it came from, whether it is synthetic
(development fixture) and when it was last verified against its source."""
import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base, Timestamps, UUIDPk


class Concentration(enum.StrEnum):
    extrait = "extrait"
    parfum = "parfum"
    edp = "edp"
    edt = "edt"
    edc = "edc"
    cologne = "cologne"
    body_mist = "body_mist"
    oil = "oil"
    other = "other"


class NotePosition(enum.StrEnum):
    top = "top"
    heart = "heart"
    base = "base"


def _enum(e: type[enum.Enum], name: str) -> Enum:
    return Enum(e, name=name, values_callable=lambda x: [m.value for m in x], native_enum=True)


class Provenance:
    data_source_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("data_sources.id", ondelete="RESTRICT"), index=True
    )
    is_synthetic: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    last_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class DataSource(UUIDPk, Timestamps, Base):
    __tablename__ = "data_sources"
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True)
    access_method: Mapped[str] = mapped_column(String(50))  # feed | api | manual | synthetic
    licence: Mapped[str] = mapped_column(Text)
    redistribution_allowed: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_synthetic: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    __table_args__ = (
        CheckConstraint("access_method IN ('feed','api','manual','synthetic')", name="access_method_known"),
    )


class FragranceFamily(UUIDPk, Timestamps, Base):
    __tablename__ = "fragrance_families"
    name: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str | None] = mapped_column(Text)


class Brand(UUIDPk, Timestamps, Provenance, Base):
    __tablename__ = "brands"
    name: Mapped[str] = mapped_column(String(200), index=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True)
    country: Mapped[str | None] = mapped_column(String(2))  # ISO 3166-1 alpha-2
    website: Mapped[str | None] = mapped_column(String(500))
    perfumes: Mapped[list["Perfume"]] = relationship(back_populates="brand")
    __table_args__ = (CheckConstraint("country IS NULL OR country ~ '^[A-Z]{2}$'", name="country_iso2"),)


class Perfumer(UUIDPk, Timestamps, Provenance, Base):
    __tablename__ = "perfumers"
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(200), unique=True)
    bio: Mapped[str | None] = mapped_column(Text)


class Accord(UUIDPk, Timestamps, Base):
    """Reference dictionary of scent accords (woody, citrus, white floral …)."""

    __tablename__ = "accords"
    name: Mapped[str] = mapped_column(String(80))
    slug: Mapped[str] = mapped_column(String(80), unique=True)
    description: Mapped[str | None] = mapped_column(Text)


class Note(UUIDPk, Timestamps, Base):
    __tablename__ = "notes"
    name: Mapped[str] = mapped_column(String(120))
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    family: Mapped[str] = mapped_column(String(60), index=True)
    tier: Mapped[NotePosition | None] = mapped_column(_enum(NotePosition, "note_position"))
    description: Mapped[str | None] = mapped_column(Text)
    aliases: Mapped[list["NoteAlias"]] = relationship(
        back_populates="note", cascade="all, delete-orphan", order_by="NoteAlias.alias"
    )


class NoteAlias(UUIDPk, Timestamps, Base):
    """Alternative names (orris → iris, agarwood → oud). alias_slug is globally unique so an alias can never point at
    two notes."""

    __tablename__ = "note_aliases"
    note_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("notes.id", ondelete="CASCADE"), index=True)
    alias: Mapped[str] = mapped_column(String(120))
    alias_slug: Mapped[str] = mapped_column(String(120), unique=True)
    note: Mapped[Note] = relationship(back_populates="aliases")


class Perfume(UUIDPk, Timestamps, Provenance, Base):
    __tablename__ = "perfumes"
    brand_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("brands.id", ondelete="RESTRICT"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    slug: Mapped[str] = mapped_column(String(250), unique=True)
    release_year: Mapped[int | None] = mapped_column(Integer, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    family_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("fragrance_families.id", ondelete="SET NULL"), index=True
    )
    gender_positioning: Mapped[str | None] = mapped_column(String(20))

    brand: Mapped[Brand] = relationship(back_populates="perfumes")
    family: Mapped[FragranceFamily | None] = relationship()
    variants: Mapped[list["PerfumeVariant"]] = relationship(
        back_populates="perfume", cascade="all, delete-orphan", order_by="PerfumeVariant.volume_ml"
    )
    note_links: Mapped[list["PerfumeNote"]] = relationship(
        back_populates="perfume", cascade="all, delete-orphan", order_by="PerfumeNote.sort_order"
    )
    accord_links: Mapped[list["PerfumeAccord"]] = relationship(
        back_populates="perfume", cascade="all, delete-orphan", order_by="PerfumeAccord.strength.desc()"
    )
    perfumer_links: Mapped[list["PerfumePerfumer"]] = relationship(
        back_populates="perfume", cascade="all, delete-orphan"
    )

    __table_args__ = (
        UniqueConstraint("brand_id", "name", name="uq_perfumes_brand_name"),
        CheckConstraint("release_year IS NULL OR release_year BETWEEN 1700 AND 2100", name="release_year_range"),
        CheckConstraint(
            "gender_positioning IS NULL OR gender_positioning IN ('feminine','masculine','unisex')",
            name="gender_positioning_known",
        ),
    )


class PerfumeVariant(UUIDPk, Timestamps, Provenance, Base):
    __tablename__ = "perfume_variants"
    perfume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("perfumes.id", ondelete="CASCADE"), index=True)
    concentration: Mapped[Concentration] = mapped_column(_enum(Concentration, "concentration"))
    volume_ml: Mapped[float] = mapped_column(Numeric(7, 2))
    gtin: Mapped[str | None] = mapped_column(String(14), unique=True)
    edition: Mapped[str] = mapped_column(String(120), default="", server_default="")
    perfume: Mapped[Perfume] = relationship(back_populates="variants")

    __table_args__ = (
        UniqueConstraint("perfume_id", "concentration", "volume_ml", "edition", name="uq_perfume_variants_exact"),
        CheckConstraint("volume_ml > 0", name="volume_positive"),
        CheckConstraint("gtin IS NULL OR gtin ~ '^[0-9]{8,14}$'", name="gtin_digits"),
    )


class PerfumeNote(Base):
    __tablename__ = "perfume_notes"
    perfume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("perfumes.id", ondelete="CASCADE"), primary_key=True)
    note_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("notes.id", ondelete="RESTRICT"), primary_key=True, index=True
    )
    position: Mapped[NotePosition] = mapped_column(_enum(NotePosition, "note_position"), primary_key=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    perfume: Mapped[Perfume] = relationship(back_populates="note_links")
    note: Mapped[Note] = relationship()


class PerfumeAccord(Base):
    """How prominent an accord is in a perfume, 1–100. Editorial or source data — never presented as a measurement."""

    __tablename__ = "perfume_accords"
    perfume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("perfumes.id", ondelete="CASCADE"), primary_key=True)
    accord_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("accords.id", ondelete="RESTRICT"), primary_key=True, index=True
    )
    strength: Mapped[int] = mapped_column(SmallInteger)
    perfume: Mapped[Perfume] = relationship(back_populates="accord_links")
    accord: Mapped[Accord] = relationship()
    __table_args__ = (CheckConstraint("strength BETWEEN 1 AND 100", name="strength_range"),)


class PerfumePerfumer(Base):
    __tablename__ = "perfume_perfumers"
    perfume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("perfumes.id", ondelete="CASCADE"), primary_key=True)
    perfumer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("perfumers.id", ondelete="RESTRICT"), primary_key=True, index=True
    )
    perfume: Mapped[Perfume] = relationship(back_populates="perfumer_links")
    perfumer: Mapped[Perfumer] = relationship()
