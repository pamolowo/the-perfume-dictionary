"""Read-only catalogue queries."""
from __future__ import annotations

import unicodedata
import uuid
from typing import Literal

from sqlalchemy import and_, func, or_, select, tuple_
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.errors import NotFound
from app.core.text import slugify
from app.models import (
    Accord,
    Brand,
    DataSource,
    FragranceFamily,
    Note,
    NoteAlias,
    Perfume,
    PerfumeAccord,
    PerfumeNote,
    PerfumePerfumer,
    Perfumer,
    PerfumeVariant,
)
from app.services.pagination import decode_cursor, encode_cursor

PerfumeSort = Literal["name", "release_year", "-release_year"]


def fold(col):
    """Accent- and case-insensitive form of a column; matches the f_unaccent trigram indexes (migration 0001)."""
    return func.f_unaccent(col)


def fold_text(q: str) -> str:
    """Python twin of f_unaccent for user input: 'Caffè' → 'caffe'."""
    return unicodedata.normalize("NFKD", q).encode("ascii", "ignore").decode().lower().strip()


def _like(q: str) -> str:
    q = fold_text(q)
    escaped = q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def _ident_filter(model, ident: str):
    try:
        return model.id == uuid.UUID(ident)
    except ValueError:
        return model.slug == ident


def _alias_slug(term: str) -> str:
    return slugify(term)


def note_by_slug_or_alias(db: Session, ident: str) -> Note | None:
    """Canonical slug/UUID first, then any alias ('orris' -> iris)."""
    n = db.scalars(select(Note).options(selectinload(Note.aliases)).where(_ident_filter(Note, ident))).first()
    if n is None:
        n = db.scalars(select(Note).options(selectinload(Note.aliases))
                       .join(NoteAlias).where(NoteAlias.alias_slug == _alias_slug(ident))).first()
    return n


def summary_options():
    return (joinedload(Perfume.brand), joinedload(Perfume.family))


def detail_options():
    return (
        *summary_options(),
        selectinload(Perfume.variants),
        selectinload(Perfume.note_links).joinedload(PerfumeNote.note),
        selectinload(Perfume.accord_links).joinedload(PerfumeAccord.accord),
        selectinload(Perfume.perfumer_links).joinedload(PerfumePerfumer.perfumer),
    )


def list_perfumes(
    db: Session, *, q: str | None = None, brand: str | None = None, note: str | None = None,
    family: str | None = None, perfumer: str | None = None, accord: str | None = None, concentration: str | None = None,
    year_from: int | None = None, year_to: int | None = None, sort: PerfumeSort = "name",
    limit: int = 20, cursor: str | None = None,
) -> tuple[list[Perfume], str | None]:
    stmt = select(Perfume).options(*summary_options())
    if q:
        like = _like(q)
        note_match = Perfume.note_links.any(PerfumeNote.note.has(
            or_(fold(Note.name).ilike(like), Note.aliases.any(fold(NoteAlias.alias).ilike(like)))))
        stmt = stmt.join(Brand, Perfume.brand_id == Brand.id).where(
            or_(fold(Perfume.name).ilike(like), fold(Brand.name).ilike(like), note_match)
        )
    if brand:
        stmt = stmt.where(Perfume.brand.has(Brand.slug == brand))
    if family:
        stmt = stmt.where(Perfume.family.has(FragranceFamily.slug == family))
    if note:
        resolved = note_by_slug_or_alias(db, note)
        target_slug = resolved.slug if resolved else note
        stmt = stmt.where(Perfume.note_links.any(PerfumeNote.note.has(Note.slug == target_slug)))
    if perfumer:
        stmt = stmt.where(Perfume.perfumer_links.any(PerfumePerfumer.perfumer.has(Perfumer.slug == perfumer)))
    if accord:
        stmt = stmt.where(Perfume.accord_links.any(PerfumeAccord.accord.has(Accord.slug == accord)))
    if concentration:
        stmt = stmt.where(Perfume.variants.any(PerfumeVariant.concentration == concentration))
    if year_from is not None:
        stmt = stmt.where(Perfume.release_year >= year_from)
    if year_to is not None:
        stmt = stmt.where(Perfume.release_year <= year_to)

    if sort == "name":
        key = func.lower(Perfume.name)
        stmt = stmt.order_by(key, Perfume.id)
        if cursor:
            value, ident = decode_cursor(cursor, sort)
            stmt = stmt.where(tuple_(key, Perfume.id) > tuple_(value, ident))
    elif sort == "release_year":
        key = func.coalesce(Perfume.release_year, 9999)
        stmt = stmt.order_by(key, Perfume.id)
        if cursor:
            value, ident = decode_cursor(cursor, sort)
            stmt = stmt.where(tuple_(key, Perfume.id) > tuple_(value, ident))
    else:  # -release_year: newest first, ties by id ascending
        key = func.coalesce(Perfume.release_year, 0)
        stmt = stmt.order_by(key.desc(), Perfume.id)
        if cursor:
            value, ident = decode_cursor(cursor, sort)
            stmt = stmt.where(or_(key < value, and_(key == value, Perfume.id > ident)))

    rows = list(db.scalars(stmt.limit(limit + 1)).unique())
    next_cursor = None
    if len(rows) > limit:
        rows = rows[:limit]
        last = rows[-1]
        if sort == "name":
            value = last.name.lower()
        elif sort == "release_year":
            value = last.release_year if last.release_year is not None else 9999
        else:
            value = last.release_year if last.release_year is not None else 0
        next_cursor = encode_cursor(sort, value, last.id)
    return rows, next_cursor


def get_perfume(db: Session, ident: str) -> Perfume:
    p = db.scalars(select(Perfume).options(*detail_options()).where(_ident_filter(Perfume, ident))).first()
    if not p:
        raise NotFound("perfume", ident)
    return p


def pyramid_of(p: Perfume) -> dict:
    out = {"top": [], "heart": [], "base": []}
    for link in sorted(p.note_links, key=lambda x: (x.position.value, x.sort_order)):
        out[link.position.value].append(link.note)
    return out


def perfume_detail_dict(p: Perfume, db: Session) -> dict:
    source = db.get(DataSource, p.data_source_id) if p.data_source_id else None
    return {
        **{k: getattr(p, k) for k in ("id", "name", "slug", "release_year", "description", "gender_positioning",
                                      "is_synthetic", "last_verified_at", "brand", "family",
                                      "variants")},
        "notes": pyramid_of(p),
        "accords": [{"slug": a.accord.slug, "name": a.accord.name, "strength": a.strength} for a in p.accord_links],
        "perfumers": [link.perfumer for link in p.perfumer_links],
        "data_source": source,
    }


def list_brands(db: Session, q: str | None, limit: int, cursor: str | None):
    counts = (select(Perfume.brand_id, func.count().label("n")).group_by(Perfume.brand_id).subquery())
    key = func.lower(Brand.name)
    stmt = (select(Brand, func.coalesce(counts.c.n, 0)).outerjoin(counts, counts.c.brand_id == Brand.id)
            .order_by(key, Brand.id))
    if q:
        stmt = stmt.where(fold(Brand.name).ilike(_like(q)))
    if cursor:
        value, ident = decode_cursor(cursor, "brand_name")
        stmt = stmt.where(tuple_(key, Brand.id) > tuple_(value, ident))
    rows = db.execute(stmt.limit(limit + 1)).all()
    nxt = None
    if len(rows) > limit:
        rows = rows[:limit]
        nxt = encode_cursor("brand_name", rows[-1][0].name.lower(), rows[-1][0].id)
    return rows, nxt


def get_brand(db: Session, slug: str) -> tuple[Brand, list[Perfume]]:
    b = db.scalars(select(Brand).where(_ident_filter(Brand, slug))).first()
    if not b:
        raise NotFound("brand", slug)
    perfumes = list(db.scalars(select(Perfume).options(*summary_options()).where(Perfume.brand_id == b.id)
                               .order_by(Perfume.release_year.desc().nulls_last(), Perfume.name)).unique())
    return b, perfumes


def list_notes(db: Session, family: str | None, tier: str | None, q: str | None, limit: int, cursor: str | None):
    key = func.lower(Note.name)
    stmt = select(Note).options(selectinload(Note.aliases)).order_by(key, Note.id)
    if family:
        stmt = stmt.where(Note.family == family)
    if tier:
        stmt = stmt.where(Note.tier == tier)
    if q:
        stmt = stmt.where(or_(fold(Note.name).ilike(_like(q)), Note.aliases.any(fold(NoteAlias.alias).ilike(_like(q)))))
    if cursor:
        value, ident = decode_cursor(cursor, "note_name")
        stmt = stmt.where(tuple_(key, Note.id) > tuple_(value, ident))
    rows = list(db.scalars(stmt.limit(limit + 1)))
    nxt = None
    if len(rows) > limit:
        rows = rows[:limit]
        nxt = encode_cursor("note_name", rows[-1].name.lower(), rows[-1].id)
    return rows, nxt


def get_note(db: Session, slug: str) -> tuple[Note, list[Perfume]]:
    n = note_by_slug_or_alias(db, slug)
    if not n:
        raise NotFound("note", slug)
    perfumes = list(db.scalars(
        select(Perfume).options(*summary_options())
        .where(Perfume.note_links.any(PerfumeNote.note_id == n.id)).order_by(Perfume.name)
    ).unique())
    return n, perfumes


def list_accords(db: Session) -> list[Accord]:
    return list(db.scalars(select(Accord).order_by(Accord.name)))


def get_accord(db: Session, slug: str) -> tuple[Accord, list[Perfume]]:
    a = db.scalars(select(Accord).where(_ident_filter(Accord, slug))).first()
    if not a:
        raise NotFound("accord", slug)
    perfumes = list(db.scalars(
        select(Perfume).options(*summary_options()).join(PerfumeAccord)
        .where(PerfumeAccord.accord_id == a.id).order_by(PerfumeAccord.strength.desc(), Perfume.name)
    ).unique())
    return a, perfumes


def list_perfumers(db: Session, limit: int, cursor: str | None):
    key = func.lower(Perfumer.name)
    stmt = select(Perfumer).order_by(key, Perfumer.id)
    if cursor:
        value, ident = decode_cursor(cursor, "perfumer_name")
        stmt = stmt.where(tuple_(key, Perfumer.id) > tuple_(value, ident))
    rows = list(db.scalars(stmt.limit(limit + 1)))
    nxt = None
    if len(rows) > limit:
        rows = rows[:limit]
        nxt = encode_cursor("perfumer_name", rows[-1].name.lower(), rows[-1].id)
    return rows, nxt


def get_perfumer(db: Session, slug: str) -> tuple[Perfumer, list[Perfume]]:
    pf = db.scalars(select(Perfumer).where(_ident_filter(Perfumer, slug))).first()
    if not pf:
        raise NotFound("perfumer", slug)
    perfumes = list(db.scalars(
        select(Perfume).options(*summary_options())
        .where(Perfume.perfumer_links.any(PerfumePerfumer.perfumer_id == pf.id)).order_by(Perfume.name)
    ).unique())
    return pf, perfumes


def _ranked_notes(db: Session, q: str, like: str, limit: int) -> list[Note]:
    """Notes matching by name or alias, best similarity first."""
    score = func.greatest(func.similarity(fold(Note.name), q),
                          func.coalesce(select(func.max(func.similarity(fold(NoteAlias.alias), q)))
                                        .where(NoteAlias.note_id == Note.id).scalar_subquery(), 0))
    stmt = (select(Note).options(selectinload(Note.aliases))
            .where(or_(fold(Note.name).ilike(like), func.similarity(fold(Note.name), q) > 0.3,
                       Note.aliases.any(or_(fold(NoteAlias.alias).ilike(like),
                                            func.similarity(fold(NoteAlias.alias), q) > 0.3))))
            .order_by(score.desc(), Note.name).limit(limit))
    return list(db.scalars(stmt).unique())


def search(db: Session, q: str, limit: int = 8) -> dict:
    """Substring match, ranked by trigram similarity (pg_trgm) so close matches come first. Accent-insensitive."""
    query = q
    like = _like(q)
    q = fold_text(q)

    def ranked(model, extra=()):
        stmt = (select(model).options(*extra)
                .where(or_(fold(model.name).ilike(like), func.similarity(fold(model.name), q) > 0.3))
                .order_by(func.similarity(fold(model.name), q).desc(), model.name).limit(limit))
        return list(db.scalars(stmt).unique())

    return {
        "query": query,
        "perfumes": ranked(Perfume, summary_options()),
        "brands": ranked(Brand),
        "notes": _ranked_notes(db, q, like, limit),
        "perfumers": ranked(Perfumer),
    }
