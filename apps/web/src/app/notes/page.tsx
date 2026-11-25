import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/states";
import { Input, PageHeading, buttonClass } from "@/components/ui";
import { api, load } from "@/lib/api";
import { humanise, one } from "@/lib/format";

export const metadata: Metadata = {
  title: "Notes dictionary",
  description: "Perfume notes from bergamot to vetiver, grouped by family, with their other names.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage({ searchParams }: PageProps<"/notes">) {
  return (
    <div className="space-y-10">
      <PageHeading title="Notes">
        The raw materials and impressions perfumes are described with, grouped by family. Many have other names: search
        for orris and you&apos;ll find iris.
      </PageHeading>
      <Suspense fallback={<ListSkeleton rows={12} label="Loading notes" />}>
        <Notes searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Notes({ searchParams }: Pick<PageProps<"/notes">, "searchParams">) {
  const q = one((await searchParams).q)?.trim().slice(0, 100) ?? "";
  // The dictionary is small (≈100 notes); fetch it in one page and group locally.
  const res = await load(api.GET("/api/v1/notes", { params: { query: { limit: 100, ...(q ? { q } : {}) } } }));
  const byFamily = new Map<string, typeof res.data>();
  for (const n of res.data) byFamily.set(n.family, [...(byFamily.get(n.family) ?? []), n]);
  const families = [...byFamily.keys()].sort();

  return (
    <div className="space-y-10">
      <form action="/notes" role="search" className="flex max-w-md gap-3">
        <label htmlFor="notes-q" className="sr-only">Find a note</label>
        <Input id="notes-q" name="q" type="search" defaultValue={q} placeholder="Find a note, e.g. orris" />
        <button type="submit" className={buttonClass("outline")}>Find</button>
      </form>
      {q && <p className="text-sm text-muted" aria-live="polite">{res.data.length} note{res.data.length === 1 ? "" : "s"} matching “{q}”. <Link href="/notes" className="underline">Show all</Link></p>}
      {families.map((family) => (
        <section key={family} aria-labelledby={`fam-${family}`} className="space-y-3">
          <h2 id={`fam-${family}`} className="font-display text-2xl font-semibold">{humanise(family)}</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {byFamily.get(family)!.map((n) => (
              <li key={n.slug}>
                <Link href={`/notes/${n.slug}`} className="underline decoration-rule-strong underline-offset-4 hover:text-accent hover:decoration-accent">{n.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
