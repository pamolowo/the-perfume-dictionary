import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PerfumeList } from "@/components/perfume-entry";
import { EmptyState, ListSkeleton } from "@/components/states";
import { Input, PageHeading, buttonClass } from "@/components/ui";
import { api, load } from "@/lib/api";
import { humanise, one } from "@/lib/format";

export const metadata: Metadata = {
  title: "Search",
  description: "Search perfumes, notes, houses and perfumers. Accents and small typos are fine.",
  // Result pages are endless variations of the same content; keep them out of search engines.
  robots: { index: false, follow: true },
};

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <div className="space-y-10">
      <PageHeading title="Search" />
      <Suspense fallback={<ListSkeleton rows={6} label="Searching" />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const q = one((await searchParams).q)?.trim().slice(0, 100) ?? "";
  const form = (
    <form action="/search" role="search" className="flex max-w-xl gap-3">
      <label htmlFor="search-q" className="sr-only">Search perfumes, notes, houses and perfumers</label>
      <Input id="search-q" name="q" type="search" defaultValue={q} required className="h-12 rounded-full px-5 text-base" />
      <button type="submit" className={buttonClass("solid", "h-12 px-6")}>Search</button>
    </form>
  );
  if (!q) return <>{form}<p className="text-muted">Type a perfume, note, house or perfumer.</p></>;

  const r = await load(api.GET("/api/v1/search", { params: { query: { q, limit: 12 } } }));
  const total = r.perfumes.length + r.notes.length + r.brands.length + r.perfumers.length;
  return (
    <>
      {form}
      <p className="text-sm text-muted" aria-live="polite">
        {total === 0 ? `Nothing found for “${q}”.` : `Results for “${q}”.`}
      </p>
      {total === 0 && (
        <EmptyState title="Nothing in the dictionary matches">
          Check the spelling, try a note&apos;s other name, or <Link href="/perfumes" className="underline">browse all perfumes</Link>.
        </EmptyState>
      )}
      {r.perfumes.length > 0 && (
        <section aria-labelledby="r-perfumes" className="space-y-3">
          <h2 id="r-perfumes" className="font-display text-3xl font-semibold">Perfumes</h2>
          <PerfumeList perfumes={r.perfumes} label="Matching perfumes" />
        </section>
      )}
      <div className="grid gap-10 md:grid-cols-3">
        {r.notes.length > 0 && (
          <LinkGroup id="r-notes" title="Notes" items={r.notes.map((n) => ({ href: `/notes/${n.slug}`, label: n.name, hint: humanise(n.family) }))} />
        )}
        {r.brands.length > 0 && <LinkGroup id="r-brands" title="Houses" items={r.brands.map((b) => ({ href: `/brands/${b.slug}`, label: b.name }))} />}
        {r.perfumers.length > 0 && <LinkGroup id="r-perfumers" title="Perfumers" items={r.perfumers.map((p) => ({ href: `/perfumers/${p.slug}`, label: p.name }))} />}
      </div>
    </>
  );
}

function LinkGroup({ id, title, items }: { id: string; title: string; items: { href: string; label: string; hint?: string }[] }) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="font-display text-2xl font-semibold">{title}</h2>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="underline decoration-rule-strong underline-offset-4 hover:text-accent">{i.label}</Link>
            {i.hint && <span className="text-sm text-subtle"> · {i.hint}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
