import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests. Locally they start `next start` against an API on :8000. In CI they run against the Docker Compose
 * stack (E2E_BASE_URL=http://localhost:3000), so the real images are what gets tested.
 */
const external = process.env.E2E_BASE_URL;
const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: external ?? `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: external ? undefined : {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/healthz`,
    env: { API_URL: process.env.E2E_API_URL ?? "http://localhost:8000" },
    reuseExistingServer: !process.env.CI,
  },
});
