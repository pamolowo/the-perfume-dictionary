"""Idempotent seed: `python -m app.seed`. Loads reference notes/accords and the SYNTHETIC catalogue fixtures.

Safe to run on every deploy: existing rows (matched by slug) are left alone. Never run against production unless the
owner approves — synthetic fixtures must not be published as real products (see CLAUDE.md rule 7)."""
import json
import logging
import sys
from collections import defaultdict
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.text import slugify
from app.models import (
    Accord,
    Brand,
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
from app.seed import fixtures as fx

REFERENCE = Path(__file__).resolve().parent.parent / "data" / "note_reference.json"
# Base notes linger, top notes fade: weight their contribution to a perfume's accord profile accordingly.
POSITION_WEIGHT = {"top": 0.7, "heart": 1.0, "base": 1.3}
MIN_ACCORD_STRENGTH = 15
log = logging.getLogger("seed")


def load_reference() -> dict:
    return json.loads(REFERENCE.read_text())


def _get_or_create(db: Session, model, slug: str, **fields):
    obj = db.scalars(select(model).where(model.slug == slug)).first()
    if obj is None:
        obj = model(slug=slug, **fields)
        db.add(obj)
        db.flush()
    return obj


def accord_profile(pyramid: dict[str, list[str]], note_accords: dict[str, dict[str, float]]) -> dict[str, int]:
    """Indicative accord strengths (1–100) for a SYNTHETIC perfume, from its pyramid. Strongest accord = 100."""
    totals: dict[str, float] = defaultdict(float)
    for position, slugs in pyramid.items():
        for slug in slugs:
            for accord, w in note_accords.get(slug, {}).items():
                totals[accord] += w * POSITION_WEIGHT[position]
    if not totals:
        return {}
    top = max(totals.values())
    scaled = {k: round(100 * v / top) for k, v in totals.items()}
    return {k: v for k, v in scaled.items() if v >= MIN_ACCORD_STRENGTH}


def seed(db: Session) -> dict:
    ref = load_reference()
    synth = _get_or_create(db, DataSource, fx.SYNTHETIC_SOURCE["slug"],
                           **{k: v for k, v in fx.SYNTHETIC_SOURCE.items() if k != "slug"})
    _get_or_create(db, DataSource, fx.REFERENCE_SOURCE["slug"],
                   **{k: v for k, v in fx.REFERENCE_SOURCE.items() if k != "slug"})
    families = {slug: _get_or_create(db, FragranceFamily, slug, name=name, description=desc)
                for name, slug, desc in fx.FAMILIES}
    accords = {a["key"]: _get_or_create(db, Accord, a["slug"], name=a["name"], description=a["description"])
               for a in ref["accords"]}

    notes: dict[str, Note] = {}
    for n in ref["notes"]:
        notes[n["slug"]] = note = _get_or_create(db, Note, n["slug"], name=n["name"], family=n["family"],
                                                 tier=NotePosition(n["tier"]) if n["tier"] else None)
        existing = {a.alias_slug for a in note.aliases}
        for alias in n["aliases"]:
            alias_slug = slugify(alias)
            if alias_slug not in existing and alias_slug not in notes and alias_slug != n["slug"]:
                db.add(NoteAlias(note_id=note.id, alias=alias, alias_slug=alias_slug))
                existing.add(alias_slug)
    db.flush()
    note_accords = {n["slug"]: n["accords"] for n in ref["notes"]}

    brands = {slug: _get_or_create(db, Brand, slug, name=name, country=country, data_source_id=synth.id,
                                   is_synthetic=True) for name, slug, country in fx.BRANDS}
    perfumers = {slug: _get_or_create(db, Perfumer, slug, name=name, data_source_id=synth.id, is_synthetic=True,
                                      bio="Fictional perfumer (synthetic fixture).")
                 for name, slug in fx.PERFUMERS}

    created = 0
    for b, name, year, fam, gender, pfs, top, heart, base, variants in fx.PERFUMES:
        slug = f"{brands[b].slug}-{slugify(name)}"
        if db.scalars(select(Perfume).where(Perfume.slug == slug)).first():
            continue
        p = Perfume(slug=slug, name=name, brand_id=brands[b].id, release_year=year, family_id=families[fam].id,
                    gender_positioning=gender, data_source_id=synth.id, is_synthetic=True,
                    description=f"Synthetic fixture: a fictional {families[fam].name.lower()} fragrance.")
        db.add(p)
        db.flush()
        pyramid = {"top": top, "heart": heart, "base": base}
        for pos, lst in pyramid.items():
            for i, n in enumerate(lst):
                db.add(PerfumeNote(perfume_id=p.id, note_id=notes[n].id, position=NotePosition(pos), sort_order=i))
        for key, strength in accord_profile(pyramid, note_accords).items():
            db.add(PerfumeAccord(perfume_id=p.id, accord_id=accords[key].id, strength=strength))
        for pf in pfs:
            db.add(PerfumePerfumer(perfume_id=p.id, perfumer_id=perfumers[pf].id))
        for conc, ml, gtin in variants:
            db.add(PerfumeVariant(perfume_id=p.id, concentration=conc, volume_ml=ml, gtin=gtin,
                                  data_source_id=synth.id, is_synthetic=True))
        created += 1
    db.commit()
    count = lambda m: db.scalar(select(func.count()).select_from(m))  # noqa: E731
    return {"perfumes_created": created, "perfumes": count(Perfume), "brands": count(Brand), "notes": count(Note),
            "aliases": count(NoteAlias), "accords": count(Accord)}


def main() -> int:
    from app.db import SessionLocal

    env = get_settings().environment
    if env == "production" and "--allow-production" not in sys.argv:
        print("Refusing to load SYNTHETIC fixtures into production (pass --allow-production to override).")
        return 2
    with SessionLocal() as session:
        print(json.dumps(seed(session)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
