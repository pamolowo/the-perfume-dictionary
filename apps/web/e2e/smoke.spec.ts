import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";

test("home page renders, reaches the API and is accessible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Every perfume, explained/);
  await expect(page.getByRole("list", { name: "Newest perfumes" }).getByRole("listitem")).toHaveCount(6);
  await expect(page.getByRole("status").filter({ hasText: "Connected to API" })).toContainText(/Connected to API .+ in \w+\./);
  await expectAccessible(page);
});

test("health endpoint answers for the cluster probes", async ({ request }) => {
  const res = await request.get("/healthz");
  expect(res.status()).toBe(200);
  expect(await res.text()).toBe("ok");
});
