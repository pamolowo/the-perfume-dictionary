import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** No serious or critical WCAG 2.2 AA violations, and no sideways scrolling on the current viewport. */
export async function expectAccessible(page: Page) {
  // After in-app navigation Next.js streams the new <title> in; wait for it rather than racing it.
  await expect(page).toHaveTitle(/The Perfume Dictionary/);
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  const [scroll, client] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
  expect(scroll, "page scrolls sideways").toBeLessThanOrEqual(client);
}

/** Structured data blocks on the page, parsed. */
export async function jsonLd(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b) as Record<string, unknown>);
}
