from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.api import API_PREFIX
from app.db import get_db
from app.models import Concentration, DataSource, FragranceFamily, NotePosition
from app.schemas.catalogue import (
    AccordDetail,
    AccordOut,
    BrandDetail,
    BrandOut,
    DataSourceOut,
    FamilyOut,
    NoteDetail,
    NoteOut,
    PerfumeDetail,
    PerfumerDetail,
    PerfumerOut,
    PerfumeSummary,
    SearchResults,
)
from app.schemas.common import ErrorResponse, Page
from app.services import catalogue
from app.services.catalogue import PerfumeSort, perfume_detail_dict

router = APIRouter(prefix=API_PREFIX, responses={404: {"model": ErrorResponse}, 400: {"model": ErrorResponse}})
DB = Annotated[Session, Depends(get_db)]
Limit = Annotated[int, Query(ge=1, le=100)]


@router.get("/perfumes", response_model=Page[PerfumeSummary], tags=["perfumes"],
            summary="Search, filter, sort and paginate perfumes")
def list_perfumes(
    db: DB,
    q: Annotated[str | None, Query(min_length=1, max_length=100,
                                    description="Perfume name, house or note (aliases included) contains")] = None,
    brand: Annotated[str | None, Query(description="Brand slug")] = None,
    note: Annotated[str | None, Query(description="Note slug")] = None,
    family: Annotated[str | None, Query(description="Family slug")] = None,
    perfumer: Annotated[str | None, Query(description="Perfumer slug")] = None,
    accord: Annotated[str | None, Query(description="Accord slug")] = None,
    concentration: Concentration | None = None,
    year_from: Annotated[int | None, Query(ge=1700, le=2100)] = None,
    year_to: Annotated[int | None, Query(ge=1700, le=2100)] = None,
    sort: PerfumeSort = "name",
    limit: Limit = 20,
    cursor: str | None = None,
):
    rows, nxt = catalogue.list_perfumes(
        db, q=q, brand=brand, note=note, family=family, perfumer=perfumer, accord=accord,
        concentration=concentration.value if concentration else None,
        year_from=year_from, year_to=year_to, sort=sort, limit=limit, cursor=cursor)
    return {"data": rows, "page": {"limit": limit, "next_cursor": nxt, "has_more": nxt is not None}}


@router.get("/perfumes/{id_or_slug}", response_model=PerfumeDetail, tags=["perfumes"], summary="Perfume profile")
def get_perfume(id_or_slug: str, db: DB):
    return perfume_detail_dict(catalogue.get_perfume(db, id_or_slug), db)


@router.get("/brands", response_model=Page[BrandOut], tags=["brands"])
def list_brands(db: DB, q: Annotated[str | None, Query(max_length=100)] = None, limit: Limit = 50,
                cursor: str | None = None):
    rows, nxt = catalogue.list_brands(db, q, limit, cursor)
    data = [{**BrandOut.model_validate(b).model_dump(), "perfume_count": n} for b, n in rows]
    return {"data": data, "page": {"limit": limit, "next_cursor": nxt, "has_more": nxt is not None}}


@router.get("/brands/{slug}", response_model=BrandDetail, tags=["brands"])
def get_brand(slug: str, db: DB):
    b, perfumes = catalogue.get_brand(db, slug)
    return {**BrandOut.model_validate(b).model_dump(), "perfume_count": len(perfumes), "perfumes": perfumes}


@router.get("/notes", response_model=Page[NoteOut], tags=["notes"], summary="Notes dictionary")
def list_notes(db: DB, family: str | None = None, tier: NotePosition | None = None,
               q: Annotated[str | None, Query(max_length=100)] = None, limit: Limit = 100, cursor: str | None = None):
    rows, nxt = catalogue.list_notes(db, family, tier.value if tier else None, q, limit, cursor)
    return {"data": rows, "page": {"limit": limit, "next_cursor": nxt, "has_more": nxt is not None}}


@router.get("/notes/{slug}", response_model=NoteDetail, tags=["notes"],
            summary="Note profile (slug, id or alias, e.g. 'orris' → iris)")
def get_note(slug: str, db: DB):
    n, perfumes = catalogue.get_note(db, slug)
    return {**NoteOut.model_validate(n).model_dump(), "perfumes": perfumes}


@router.get("/accords", response_model=list[AccordOut], tags=["accords"], summary="Accords dictionary")
def list_accords(db: DB):
    return catalogue.list_accords(db)


@router.get("/accords/{slug}", response_model=AccordDetail, tags=["accords"],
            summary="Accord with the perfumes where it is most prominent")
def get_accord(slug: str, db: DB):
    a, perfumes = catalogue.get_accord(db, slug)
    return {**AccordOut.model_validate(a).model_dump(), "perfumes": perfumes}


@router.get("/perfumers", response_model=Page[PerfumerOut], tags=["perfumers"])
def list_perfumers(db: DB, limit: Limit = 50, cursor: str | None = None):
    rows, nxt = catalogue.list_perfumers(db, limit, cursor)
    return {"data": rows, "page": {"limit": limit, "next_cursor": nxt, "has_more": nxt is not None}}


@router.get("/perfumers/{slug}", response_model=PerfumerDetail, tags=["perfumers"])
def get_perfumer(slug: str, db: DB):
    pf, perfumes = catalogue.get_perfumer(db, slug)
    return {**PerfumerOut.model_validate(pf).model_dump(), "perfumes": perfumes}


@router.get("/families", response_model=list[FamilyOut], tags=["families"])
def list_families(db: DB):
    return list(db.scalars(select(FragranceFamily).order_by(FragranceFamily.name)))


@router.get("/search", response_model=SearchResults, tags=["search"], summary="Search across the catalogue")
def search(db: DB, q: Annotated[str, Query(min_length=1, max_length=100)],
           limit: Annotated[int, Query(ge=1, le=25)] = 8):
    return catalogue.search(db, q.strip(), limit)


@router.get("/data-sources", response_model=list[DataSourceOut], tags=["provenance"],
            summary="Data sources, licences and synthetic flags")
def data_sources(db: DB):
    return list(db.scalars(select(DataSource).order_by(DataSource.name)))
