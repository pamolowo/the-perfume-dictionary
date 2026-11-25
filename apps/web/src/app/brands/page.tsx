import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExpiredLink } from "@/components/expired-link";
import { Pagination } from "@/components/pagination";
import { ListSkeleton } from "@/components/states";
import { PageHeading } from "@/components/ui";
import { api, loadPage } from "@/lib/api";
import { countryName, one } from "@/lib/format";

export const metadata: Metadata = {
  title: "Perfume houses",
  description: "Every perfume house in the dictionary, with where they're based and how many of their perfumes we list.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage({ searchParams }: PageProps<"/brands">) {
  return (
    <div className="space-y-10">
      <PageHeading title="Houses">The perfume houses in the dictionary.</PageHeading>
      <Suspense fallback={<ListSkeleton rows={9} label="Loading houses" />}>
        <Brands searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Brands({ searchParams }: Pick<PageProps<"/brands">, "searchParams">) {
  const cursor = one((await searchParams).cursor);
  const res = await loadPage(() => api.GET("/api/v1/brands", { params: { query: { limit: 60, ...(cursor ? { cursor } : {}) } } }), !!cursor);
  if (res === "bad-cursor") return <ExpiredLink href="/brands" />;
  return (
    <>
      <ul aria-label="Houses" className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {res.data.map((b) => (
          <li key={b.slug} className="group relative border-t border-rule py-4">
            <h2 className="font-display text-2xl font-semibold">
              <Link href={`/brands/${b.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">{b.name}</Link>
            </h2>
            <p className="text-sm text-muted">
              {[countryName(b.country), `${b.perfume_count} perfume${b.perfume_count === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
            </p>
          </li>
        ))}
      </ul>
      <Pagination path="/brands" params={{}} cursor={cursor} next={res.page.next_cursor} />
    </>
  );
}
