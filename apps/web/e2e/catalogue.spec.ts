import { expect, test } from "@playwright/test";
import { expectAccessible, jsonLd } from "./helpers";

// The seeded SYNTHETIC catalogue (apps/api/app/seed) is the fixture: 24 perfumes, 8 houses, 75 notes, 16 accords.

test("perfume page: pyramid, accords, bottles, provenance, metadata", async ({ page }) => {
  await page.goto("/perfumes/casa-ficta-caffe-notturno");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Caffè Notturno");
  await expect(page.getByRole("list", { name: "Top notes" }).getByRole("link")).toHaveText(["Cardamom", "Pink Pepper"]);
  await expect(page.getByRole("list", { name: "Base notes" }).getByRole("link")).toHaveText(["Vanilla", "Cacao", "Patchouli"]);
  await expect(page.getByRole("region", { name: "Main accords" }).getByRole("link").first()).toHaveText("Gourmand");
  await expect(page.getByText("Sample record: this perfume is fictional")).toBeVisible();
  await expect(page.getByRole("complementary", { name: "About this record" })).toContainText("Synthetic");
  await expect(page).toHaveTitle("Caffè Notturno by Casa Ficta · The Perfume Dictionary");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/); // fictional record
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/perfumes\/casa-ficta-caffe-notturno$/);
  const types = (await jsonLd(page)).map((d) => d["@type"]);
  expect(types).toEqual(expect.arrayContaining(["Product", "BreadcrumbList"]));
  await expectAccessible(page);
});

test("perfume page links through to its note, accord, house and perfumer", async ({ page }) => {
  await page.goto("/perfumes/casa-ficta-caffe-notturno");
  await page.getByRole("list", { name: "Base notes" }).getByRole("link", { name: "Vanilla" }).click();
  await expect(page).toHaveURL(/\/notes\/vanilla$/);
  await expect(page.getByRole("list", { name: "Perfumes with Vanilla" })).toContainText("Caffè Notturno");
  await page.goBack();
  await page.getByRole("region", { name: "Main accords" }).getByRole("link", { name: "Gourmand" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gourmand");
  await expect(page.getByRole("list", { name: "Gourmand perfumes" }).getByRole("listitem").first()).toBeVisible();
});

test("browse perfumes with filters and pagination", async ({ page }) => {
  await page.goto("/perfumes");
  await expect(page.getByRole("list", { name: "Perfumes" }).getByRole("listitem")).toHaveCount(18);
  await page.getByRole("link", { name: "Next page" }).click();
  await expect(page.getByRole("list", { name: "Perfumes" }).getByRole("listitem")).toHaveCount(6);
  await expect(page.getByRole("link", { name: "Back to first page" })).toBeVisible();

  await page.goto("/perfumes");
  await page.getByLabel("Accord").selectOption("leather");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/accord=leather/);
  await expect(page.getByRole("list", { name: "Perfumes" })).toContainText("Birch Smoke");
  await expectAccessible(page);
});

test("filters that match nothing, and stale page links, explain themselves", async ({ page }) => {
  await page.goto("/perfumes?q=zzzz-not-a-perfume");
  await expect(page.getByText("Nothing matches those filters")).toBeVisible();
  await page.goto("/perfumes?cursor=not-a-real-cursor");
  await expect(page.getByText("That page link has expired")).toBeVisible();
});

test("houses, notes, accords and perfumers index and detail pages", async ({ page }) => {
  await page.goto("/brands");
  await expect(page.getByRole("list", { name: "Houses" }).getByRole("listitem")).toHaveCount(8);
  await page.getByRole("link", { name: "Casa Ficta" }).click();
  await expect(page.getByRole("list", { name: "Casa Ficta perfumes" }).getByRole("listitem")).toHaveCount(3);
  await expectAccessible(page);

  await page.goto("/notes");
  await expect(page.getByRole("heading", { name: "Citrus", level: 2 })).toBeVisible();
  await page.getByLabel("Find a note").fill("orris");
  await page.getByRole("button", { name: "Find" }).click();
  await expect(page.getByText(/1 note matching/)).toBeVisible();
  await expectAccessible(page);

  await page.goto("/accords");
  await expect(page.getByRole("list", { name: "Accords" }).getByRole("listitem")).toHaveCount(16);
  await expectAccessible(page);

  await page.goto("/perfumers");
  await page.getByRole("link", { name: "Ada Fixture" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ada Fixture");
  await expect(page.getByRole("list", { name: "Perfumes by Ada Fixture" }).getByRole("listitem").first()).toBeVisible();
  await expectAccessible(page);
});

test("a note's other name opens the canonical note page", async ({ page }) => {
  await page.goto("/notes/agarwood");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Oud/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/notes\/oud$/);
});

test("site search tolerates accents and typos", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: /Search perfumes, notes, houses and perfumers/ }).fill("caffe");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("list", { name: "Matching perfumes" })).toContainText("Caffè Notturno");
  await page.goto("/search?q=vanila");
  await expect(page.getByRole("region", { name: "Notes" })).toContainText("Vanilla");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expectAccessible(page);
});

test("unknown pages show the not-found page and are not indexed", async ({ page }) => {
  for (const url of ["/perfumes/not-a-perfume", "/brands/nope", "/notes/nope", "/accords/nope", "/perfumers/nope"]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: "Not in the dictionary" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  }
});

test("navigation works on every screen size", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByText("Menu", { exact: true }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Accords" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Accords" }).click();
  }
  await expect(page).toHaveURL(/\/accords$/);
});

test("robots.txt keeps previews out of search engines; the sitemap skips fictional records", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//); // ALLOW_INDEXING is not set outside production
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/notes/vanilla</loc>");
  expect(sitemap).toContain("/accords/woody</loc>");
  expect(sitemap).not.toContain("/perfumes/casa-ficta"); // synthetic perfumes are noindex, so not listed
});

test("link-preview bots get title, description and preview tags in <head>", async ({ request }) => {
  // Browsers get metadata streamed after the first bytes; crawlers that don't run JavaScript must get it up front.
  const res = await request.get("/perfumes/casa-ficta-caffe-notturno", { headers: { "user-agent": "facebookexternalhit/1.1" } });
  const head = (await res.text()).split("</head>")[0];
  expect(head).toContain("<title>Caffè Notturno by Casa Ficta · The Perfume Dictionary</title>");
  expect(head).toMatch(/<meta name="description" content="Caffè Notturno by Casa Ficta \(2024\)/);
  expect(head).toMatch(/<meta property="og:title" content="Caffè Notturno by Casa Ficta"/);
  expect(head).toMatch(/<link rel="canonical" href="[^"]+\/perfumes\/casa-ficta-caffe-notturno"/);
});
