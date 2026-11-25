import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { absoluteUrl, indexingAllowed } from "@/lib/site";

/** Read at request time, so the same image can serve a crawlable production site and a hidden preview. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  if (!indexingAllowed()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/search"] }, sitemap: absoluteUrl("/sitemap.xml") };
}
