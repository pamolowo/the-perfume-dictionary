import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PerfumeList } from "@/components/perfume-entry";
import { EmptyState, HeadingSkeleton } from "@/components/states";
import { PageHeading } from "@/components/ui";
import { api, load, loadOptional } from "@/lib/api";

const getAccord = (slug: string) => api.GET("/api/v1/accords/{slug}", { params: { path: { slug } } });

export async function generateMetadata({ params }: PageProps<"/accords/[slug]">): Promise<Metadata> {
  const a = await loadOptional(getAccord((await params).slug));
  if (!a) return { title: "Accord not found", robots: { index: false } };
  return {
    title: `${a.name} perfumes`,
    description: `${a.description ?? `The ${a.name.toLowerCase()} accord.`} Perfumes where it is most prominent.`,
    alternates: { canonical: `/accords/${a.slug}` },
  };
}

export default function AccordPage({ params }: PageProps<"/accords/[slug]">) {
  return (
    <Suspense fallback={<HeadingSkeleton label="Loading accord" />}>
      <Accord params={params} />
    </Suspense>
  );
}

async function Accord({ params }: Pick<PageProps<"/accords/[slug]">, "params">) {
  const a = await load(getAccord((await params).slug));
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ name: "Accords", href: "/accords" }, { name: a.name, href: `/accords/${a.slug}` }]} />
      <PageHeading eyebrow="Accord" title={a.name}>{a.description}</PageHeading>
      <section aria-labelledby="most-h" className="space-y-4">
        <h2 id="most-h" className="font-display text-3xl font-semibold">Where it stands out most</h2>
        {a.perfumes.length ? (
          <PerfumeList perfumes={a.perfumes} label={`${a.name} perfumes`} />
        ) : (
          <EmptyState title="No perfumes list this accord yet" />
        )}
        <p className="text-xs text-subtle">Ordered by how prominent the accord is in each perfume.</p>
      </section>
    </div>
  );
}
