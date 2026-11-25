/** Public base URL of the site (canonical links, sitemap, structured data). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "The Perfume Dictionary";

/**
 * Whether search engines may index the site. Off unless ALLOW_INDEXING=true: the catalogue is synthetic sample data,
 * and preview deployments must never compete with the real site in search results.
 */
export const indexingAllowed = () => process.env.ALLOW_INDEXING === "true";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
