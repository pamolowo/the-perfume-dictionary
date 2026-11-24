"""Catalogue API: listing, filters, pagination, detail, search, errors, provenance."""
import pytest

pytestmark = pytest.mark.usefixtures("seeded")


def test_seed_is_idempotent(seeded):
    from app.db import SessionLocal
    from app.seed.__main__ import seed

    with SessionLocal() as db:
        again = seed(db)
    assert again["perfumes_created"] == 0
    assert {k: again[k] for k in ("perfumes", "brands", "notes", "accords")} == {
        "perfumes": 24, "brands": 8, "notes": 75, "accords": 16}


def test_every_catalogue_row_is_flagged_synthetic(client):
    data = client.get("/api/v1/perfumes?limit=100").json()["data"]
    assert len(data) == 24
    assert all(p["is_synthetic"] and p["brand"]["is_synthetic"] for p in data)
    sources = {s["slug"]: s for s in client.get("/api/v1/data-sources").json()}
    assert sources["synthetic-fixtures"]["is_synthetic"] is True
    assert sources["synthetic-fixtures"]["redistribution_allowed"] is False


@pytest.mark.parametrize("sort", ["name", "release_year", "-release_year"])
def test_cursor_pagination_visits_every_row_once(client, sort):
    seen, cursor, pages = [], None, 0
    while True:
        body = client.get(f"/api/v1/perfumes?limit=5&sort={sort}" + (f"&cursor={cursor}" if cursor else "")).json()
        seen += [p["slug"] for p in body["data"]]
        pages += 1
        cursor = body["page"]["next_cursor"]
        if not cursor:
            assert body["page"]["has_more"] is False
            break
    assert len(seen) == len(set(seen)) == 24 and pages == 5
    if sort != "name":
        years = [p["release_year"] for p in client.get(f"/api/v1/perfumes?limit=100&sort={sort}").json()["data"]]
        assert years == sorted(years, reverse=sort.startswith("-"))


def test_cursor_from_another_sort_is_rejected(client):
    cursor = client.get("/api/v1/perfumes?limit=2&sort=name").json()["page"]["next_cursor"]
    r = client.get(f"/api/v1/perfumes?limit=2&sort=release_year&cursor={cursor}")
    assert r.status_code == 400 and r.json()["error"]["code"] == "bad_request"


@pytest.mark.parametrize(("query", "expected"), [
    ("brand=kori-studio", {"kori-studio-yuzu-draft", "kori-studio-hinoki-sample", "kori-studio-sakura-mock"}),
    ("note=oud", {"saffron-and-sable-oud-mirage", "ivory-lane-lagos-noir"}),
    ("note=agarwood", {"saffron-and-sable-oud-mirage", "ivory-lane-lagos-noir"}),  # alias resolves to oud
    ("concentration=cologne", {"casa-ficta-limone-finto"}),
    ("family=leather", {"northwind-parfums-birch-smoke", "ivory-lane-suede-draft"}),
    ("perfumer=tomas-demo&year_from=2023", {"casa-ficta-caffe-notturno", "ivory-lane-lagos-noir",
                                            "ivory-lane-suede-draft"} - {"ivory-lane-suede-draft"}),
])
def test_filters(client, query, expected):
    data = client.get(f"/api/v1/perfumes?limit=100&{query}").json()["data"]
    assert {p["slug"] for p in data} == expected


def test_accord_filter_and_accord_page(client):
    leather = {p["slug"] for p in client.get("/api/v1/perfumes?accord=leather&limit=100").json()["data"]}
    assert {"northwind-parfums-birch-smoke", "ivory-lane-suede-draft"} <= leather
    page = client.get("/api/v1/accords/leather").json()
    assert page["name"] == "Leather" and page["perfumes"][0]["slug"] in leather
    assert len(client.get("/api/v1/accords").json()) == 16


def test_perfume_detail(client):
    p = client.get("/api/v1/perfumes/casa-ficta-caffe-notturno").json()
    assert [n["slug"] for n in p["notes"]["top"]] == ["cardamom", "pink-pepper"]
    assert [n["slug"] for n in p["notes"]["base"]] == ["vanilla", "cacao", "patchouli"]
    strengths = [a["strength"] for a in p["accords"]]
    assert strengths == sorted(strengths, reverse=True) and strengths[0] == 100
    assert all(1 <= s <= 100 for s in strengths)
    assert p["accords"][0]["slug"] == "gourmand"
    assert p["perfumers"][0]["slug"] == "tomas-demo"
    assert p["data_source"]["slug"] == "synthetic-fixtures"
    by_id = client.get(f"/api/v1/perfumes/{p['id']}").json()
    assert by_id["slug"] == p["slug"]


def test_brand_note_perfumer_pages(client):
    brand = client.get("/api/v1/brands/atelier-nimbus").json()
    assert brand["perfume_count"] == 3 and len(brand["perfumes"]) == 3
    assert {b["slug"]: b["perfume_count"] for b in client.get("/api/v1/brands").json()["data"]}["casa-ficta"] == 3
    iris = client.get("/api/v1/notes/orris").json()  # alias → canonical note
    assert iris["slug"] == "iris" and "orris" in iris["aliases"] and iris["perfumes"]
    assert client.get("/api/v1/perfumers/ada-fixture").json()["perfumes"]
    assert len(client.get("/api/v1/families").json()) == 8


def test_notes_dictionary_filters(client):
    citrus = client.get("/api/v1/notes?family=citrus&limit=100").json()["data"]
    assert citrus and all(n["family"] == "citrus" for n in citrus)
    by_alias = client.get("/api/v1/notes?q=cassis").json()["data"]
    assert [n["slug"] for n in by_alias] == ["blackcurrant"]


@pytest.mark.parametrize(("q", "section", "slug"), [
    ("vanila", "notes", "vanilla"),                       # typo tolerated (trigram similarity)
    ("caffe", "perfumes", "casa-ficta-caffe-notturno"),
    ("nimbus", "brands", "atelier-nimbus"),
    ("frankincense", "notes", "incense"),                 # alias
    ("synthea", "perfumers", "mira-synthea"),
])
def test_search(client, q, section, slug):
    body = client.get(f"/api/v1/search?q={q}").json()
    assert body[section] and body[section][0]["slug"] == slug


def test_search_escapes_like_wildcards(client):
    body = client.get("/api/v1/search?q=%25").json()  # a literal "%" must not match everything
    assert all(len(body[k]) == 0 for k in ("perfumes", "brands", "notes", "perfumers"))


@pytest.mark.parametrize("url", ["/api/v1/perfumes/nope", "/api/v1/brands/nope", "/api/v1/notes/nope",
                                 "/api/v1/accords/nope", "/api/v1/perfumers/nope"])
def test_not_found_uses_error_schema(client, url):
    r = client.get(url)
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "not_found"


@pytest.mark.parametrize("url", ["/api/v1/perfumes?limit=0", "/api/v1/perfumes?limit=101",
                                 "/api/v1/perfumes?year_from=1500", "/api/v1/search?q=",
                                 "/api/v1/perfumes?concentration=perfume-ish"])
def test_validation_errors(client, url):
    r = client.get(url)
    assert r.status_code == 422 and r.json()["error"]["code"] == "validation_error"


def test_metrics_label_catalogue_routes_by_template(client):
    client.get("/api/v1/perfumes/casa-ficta-limone-finto")
    text = client.get("/metrics").text
    assert 'route="/api/v1/perfumes/{id_or_slug}"' in text
    assert "limone-finto" not in text


def test_search_and_filter_are_accent_insensitive(client):
    for q in ("caffe", "Caffè", "CAFFE"):
        assert client.get(f"/api/v1/search?q={q}").json()["perfumes"][0]["slug"] == "casa-ficta-caffe-notturno"
    assert client.get("/api/v1/search?q=Caffè").json()["query"] == "Caffè"
    assert client.get("/api/v1/perfumes?q=hypothese").json()["data"][0]["slug"] == "maison-exemplar-rose-hypothese"
    assert client.get("/api/v1/brands?q=kori").json()["data"][0]["slug"] == "kori-studio"  # Kōri
