import { CONCENTRATIONS, one } from "@/lib/format";

export type SP = Record<string, string | string[] | undefined>;
const FILTERS = ["q", "brand", "note", "accord", "family", "perfumer", "concentration", "year_from", "year_to", "sort"] as const;
export const SORTS = [
  { value: "name", label: "Name A–Z" },
  { value: "-release_year", label: "Newest first" },
  { value: "release_year", label: "Oldest first" },
];

/** Keep only well-formed filters from the URL; anything else is dropped rather than sent to the API. */
export function cleanFilters(sp: SP): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of FILTERS) {
    const v = one(sp[k])?.trim();
    if (!v) continue;
    if (k === "sort" && !SORTS.some((s) => s.value === v)) continue;
    if (k === "concentration" && !(CONCENTRATIONS as readonly string[]).includes(v)) continue;
    if (k.startsWith("year_")) {
      const y = Number(v);
      if (!Number.isInteger(y) || y < 1700 || y > 2100) continue;
    }
    out[k] = v.slice(0, 100);
  }
  return out;
}
