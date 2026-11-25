const CONCENTRATION: Record<string, string> = {
  extrait: "Extrait de parfum", parfum: "Parfum", edp: "Eau de parfum", edt: "Eau de toilette",
  edc: "Eau de cologne", cologne: "Cologne", body_mist: "Body mist", oil: "Perfume oil", other: "Other",
};
export const CONCENTRATIONS = ["extrait", "parfum", "edp", "edt", "edc", "cologne"] as const;
export const concentrationLabel = (c: string) => CONCENTRATION[c] ?? c;

export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

const COUNTRIES: Record<string, string> = {
  GB: "United Kingdom", FR: "France", IT: "Italy", JP: "Japan", NG: "Nigeria", US: "United States", AE: "United Arab Emirates",
};
export const countryName = (code?: string | null) => (code ? (COUNTRIES[code] ?? code) : null);

/** "white_floral" / "white-floral" → "White floral" */
export const humanise = (s: string) => {
  const t = s.replace(/[-_]/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** First value of a search param. */
export const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
