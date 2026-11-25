import { describe, expect, it } from "vitest";
import { cleanFilters } from "@/lib/filters";
import { countryName, humanise } from "@/lib/format";

describe("cleanFilters", () => {
  it("keeps well-formed filters", () => {
    expect(cleanFilters({ q: " rose ", accord: "woody", year_from: "2020", sort: "-release_year", concentration: "edp" }))
      .toEqual({ q: "rose", accord: "woody", year_from: "2020", sort: "-release_year", concentration: "edp" });
  });

  it("drops junk from the URL instead of passing it to the API", () => {
    expect(cleanFilters({ sort: "DROP TABLE", concentration: "perfume-ish", year_from: "1500", year_to: "abcd", q: "" })).toEqual({});
  });

  it("ignores unknown parameters and takes the first of repeated ones", () => {
    expect(cleanFilters({ evil: "x", note: ["vanilla", "oud"] })).toEqual({ note: "vanilla" });
  });

  it("caps very long values", () => {
    expect(cleanFilters({ q: "a".repeat(500) }).q).toHaveLength(100);
  });
});

describe("format helpers", () => {
  it("humanises accord and family keys", () => {
    expect(humanise("white_floral")).toBe("White floral");
    expect(humanise("white-floral")).toBe("White floral");
  });

  it("names countries and falls back to the code", () => {
    expect(countryName("IT")).toBe("Italy");
    expect(countryName("ZZ")).toBe("ZZ");
    expect(countryName(null)).toBeNull();
  });
});
