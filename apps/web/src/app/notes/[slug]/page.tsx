import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PerfumeList } from "@/components/perfume-entry";
import { EmptyState, HeadingSkeleton } from "@/components/states";
import { PageHeading } from "@/components/ui";
import { api, load, loadOptional } from "@/lib/api";
import { humanise } from "@/lib/format";

const getNote = (slug: string) => api.GET("/api/v1/notes/{slug}", { params: { path: { slug } } });
const TIER_TEXT = { top: "usually a top note", heart: "usually a heart note", base: "usually a base note" } as const;

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const n = await loadOptional(getNote((await params).slug));
  if (!n) return { title: "Note not found", robots: { index: false } };
  return {
    title: `${n.name} in perfume`,
    description: `${n.name}${n.aliases.length ? ` (also ${n.aliases.join(", ")})` : ""}: a ${humanise(n.family).toLowerCase()} note, and the perfumes that feature it.`,
    // Aliases (e.g. /notes/orris) resolve to the canonical note page.
    alternates: { canonical: `/notes/${n.slug}` },
  };
}

export default function NotePage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <Suspense fallback={<HeadingSkeleton label="Loading note" />}>
      <Note params={params} />
    </Suspense>
  );
}

async function Note({ params }: Pick<PageProps<"/notes/[slug]">, "params">) {
  const n = await load(getNote((await params).slug));
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ name: "Notes", href: "/notes" }, { name: n.name, href: `/notes/${n.slug}` }]} />
      <PageHeading eyebrow={`${humanise(n.family)} note${n.tier ? `, ${TIER_TEXT[n.tier]}` : ""}`} title={n.name}>
        {n.description}
        {n.aliases.length > 0 && <p className="text-base">Also known as {n.aliases.join(", ")}.</p>}
      </PageHeading>
      <section aria-labelledby="with-h" className="space-y-4">
        <h2 id="with-h" className="font-display text-3xl font-semibold">Perfumes with {n.name.toLowerCase()}</h2>
        {n.perfumes.length ? <PerfumeList perfumes={n.perfumes} label={`Perfumes with ${n.name}`} /> : <EmptyState title="No perfumes list this note yet" />}
      </section>
    </div>
  );
}
