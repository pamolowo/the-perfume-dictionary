import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { api } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];
const page = (path: string, priority = 0.5): Entry => ({ url: absoluteUrl(path), changeFrequency: "weekly", priority });

/** Follow cursor pagination to the end (bounded, in case the API misbehaves). */
async function all<T>(fetchPage: (cursor?: string) => Promise<{ data?: { data: T[]; page: { next_cursor: string | null } } }>) {
  const out: T[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 200; i++) {
    const { data } = await fetchPage(cursor);
    if (!data) break;
    out.push(...data.data);
    if (!data.page.next_cursor) break;
    cursor = data.page.next_cursor;
  }
  return out;
}

/**
 * Built at request time from the live catalogue. Fictional (synthetic) records are left out: they're marked
 * noindex, and a sitemap must only list pages we want in search results.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const entries: MetadataRoute.Sitemap = [page("/", 1), page("/perfumes", 0.8), page("/notes", 0.7), page("/accords", 0.7), page("/brands", 0.6), page("/perfumers", 0.5)];
  try {
    const [perfumes, brands, notes, accords, perfumers] = await Promise.all([
      all((cursor) => api.GET("/api/v1/perfumes", { params: { query: { limit: 100, ...(cursor ? { cursor } : {}) } } })),
      all((cursor) => api.GET("/api/v1/brands", { params: { query: { limit: 100, ...(cursor ? { cursor } : {}) } } })),
      all((cursor) => api.GET("/api/v1/notes", { params: { query: { limit: 100, ...(cursor ? { cursor } : {}) } } })),
      api.GET("/api/v1/accords").then((r) => r.data ?? []),
      all((cursor) => api.GET("/api/v1/perfumers", { params: { query: { limit: 100, ...(cursor ? { cursor } : {}) } } })),
    ]);
    entries.push(
      ...perfumes.filter((p) => !p.is_synthetic).map((p) => page(`/perfumes/${p.slug}`, 0.9)),
      ...brands.filter((b) => !b.is_synthetic).map((b) => page(`/brands/${b.slug}`, 0.6)),
      ...perfumers.filter((p) => !p.is_synthetic).map((p) => page(`/perfumers/${p.slug}`, 0.4)),
      ...notes.map((n) => page(`/notes/${n.slug}`, 0.6)),
      ...accords.map((a) => page(`/accords/${a.slug}`, 0.6)),
    );
  } catch {
    // API unavailable: serve the static pages rather than failing the sitemap.
  }
  return entries;
}
