import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExpiredLink } from "@/components/expired-link";
import { Pagination } from "@/components/pagination";
import { ListSkeleton } from "@/components/states";
import { PageHeading } from "@/components/ui";
import { api, loadPage } from "@/lib/api";
import { one } from "@/lib/format";

export const metadata: Metadata = {
  title: "Perfumers",
  description: "The noses behind the perfumes in the dictionary.",
  alternates: { canonical: "/perfumers" },
};

export default function PerfumersPage({ searchParams }: PageProps<"/perfumers">) {
  return (
    <div className="space-y-10">
      <PageHeading title="Perfumers">The noses behind the perfumes.</PageHeading>
      <Suspense fallback={<ListSkeleton rows={6} label="Loading perfumers" />}>
        <Perfumers searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Perfumers({ searchParams }: Pick<PageProps<"/perfumers">, "searchParams">) {
  const cursor = one((await searchParams).cursor);
  const res = await loadPage(() => api.GET("/api/v1/perfumers", { params: { query: { limit: 60, ...(cursor ? { cursor } : {}) } } }), !!cursor);
  if (res === "bad-cursor") return <ExpiredLink href="/perfumers" />;
  return (
    <>
      <ul aria-label="Perfumers" className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {res.data.map((p) => (
          <li key={p.slug} className="group relative border-t border-rule py-4">
            <h2 className="font-display text-2xl font-semibold">
              <Link href={`/perfumers/${p.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">{p.name}</Link>
            </h2>
          </li>
        ))}
      </ul>
      <Pagination path="/perfumers" params={{}} cursor={cursor} next={res.page.next_cursor} />
    </>
  );
}
