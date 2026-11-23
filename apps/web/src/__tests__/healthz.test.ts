import { describe, expect, it } from "vitest";
import { GET } from "@/app/healthz/route";

describe("/healthz", () => {
  it("answers 200 ok without caching", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ok");
    expect(res.headers.get("cache-control")).toBe("no-store");
  });
});
