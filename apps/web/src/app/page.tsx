import Link from "next/link";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { PerfumeList } from "@/components/perfume-entry";
import { ListSkeleton } from "@/components/states";
import { buttonClass } from "@/components/ui";
import { api, loadOptional } from "@/lib/api";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export default function Home() {
  return (
    <div className="space-y-20 pt-14">
      <section className="space-y-6">
        <h1 className="font-display text-[clamp(3rem,9vw,6rem)] font-semibold leading-[0.9] tracking-tight">
          Every perfume, <span className="italic text-accent">explained</span>.
        </h1>
        <p className="max-w-prose text-lg text-muted">
          Look up a fragrance and see what&apos;s in it: its notes from first spray to dry-down, its main accords,
          the house that made it and the perfumer behind it.
        </p>
        <form action="/search" role="search" className="flex max-w-xl gap-3">
          <label htmlFor="home-q" className="sr-only">Search perfumes, notes, houses and perfumers</label>
          <input id="home-q" name="q" type="search" required placeholder="Try “vanilla”, “oud” or a house name"
            className="h-12 min-w-0 flex-1 rounded-full border border-rule-strong bg-surface px-5 text-base placeholder:text-subtle" />
          <button type="submit" className={buttonClass("solid", "h-12 px-6")}>Search</button>
        </form>
      </section>

      <section aria-labelledby="new-h" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="new-h" className="font-display text-3xl font-semibold">Newest in the dictionary</h2>
          <Link href="/perfumes?sort=-release_year" className="text-sm underline underline-offset-4 hover:text-accent">All perfumes</Link>
        </div>
        <Suspense fallback={<ListSkeleton rows={6} label="Loading perfumes" />}>
          <Newest />
        </Suspense>
      </section>

      <section aria-labelledby="accords-h" className="space-y-4">
        <h2 id="accords-h" className="font-display text-3xl font-semibold">Browse by accord</h2>
        <Suspense fallback={<ListSkeleton rows={3} label="Loading accords" />}>
          <Accords />
        </Suspense>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
        }}
      />
    </div>
  );
}

async function Newest() {
  const res = await loadOptional(api.GET("/api/v1/perfumes", { params: { query: { sort: "-release_year", limit: 6 } } }));
  if (!res) return <p className="text-sm text-muted">Perfumes couldn&apos;t be loaded right now.</p>;
  return <PerfumeList perfumes={res.data} label="Newest perfumes" />;
}

async function Accords() {
  const accords = await loadOptional(api.GET("/api/v1/accords"));
  if (!accords) return <p className="text-sm text-muted">Accords couldn&apos;t be loaded right now.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {accords.map((a) => (
        <li key={a.slug}>
          <Link href={`/accords/${a.slug}`} className="inline-block rounded-full border border-rule-strong px-4 py-2 text-sm hover:border-accent hover:text-accent">
            {a.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
