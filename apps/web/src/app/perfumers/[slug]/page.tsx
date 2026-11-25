import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PerfumeList } from "@/components/perfume-entry";
import { EmptyState, HeadingSkeleton } from "@/components/states";
import { Badge, PageHeading } from "@/components/ui";
import { api, load, loadOptional } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";

const getPerfumer = (slug: string) => api.GET("/api/v1/perfumers/{slug}", { params: { path: { slug } } });

export async function generateMetadata({ params }: PageProps<"/perfumers/[slug]">): Promise<Metadata> {
  const p = await loadOptional(getPerfumer((await params).slug));
  if (!p) return { title: "Perfumer not found", robots: { index: false } };
  return {
    title: `${p.name}, perfumer`,
    description: `Perfumes created by ${p.name}.`,
    alternates: { canonical: `/perfumers/${p.slug}` },
    robots: p.is_synthetic ? { index: false, follow: true } : undefined,
  };
}

export default function PerfumerPage({ params }: PageProps<"/perfumers/[slug]">) {
  return (
    <Suspense fallback={<HeadingSkeleton label="Loading perfumer" />}>
      <Perfumer params={params} />
    </Suspense>
  );
}

async function Perfumer({ params }: Pick<PageProps<"/perfumers/[slug]">, "params">) {
  const p = await load(getPerfumer((await params).slug));
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ name: "Perfumers", href: "/perfumers" }, { name: p.name, href: `/perfumers/${p.slug}` }]} />
      <PageHeading eyebrow="Perfumer" title={p.name}>{p.bio}</PageHeading>
      {p.is_synthetic && <Badge tone="sample">Sample record: this perfumer is fictional</Badge>}
      <section aria-labelledby="works-h" className="space-y-4">
        <h2 id="works-h" className="font-display text-3xl font-semibold">Perfumes</h2>
        {p.perfumes.length ? <PerfumeList perfumes={p.perfumes} label={`Perfumes by ${p.name}`} /> : <EmptyState title="No perfumes listed yet" />}
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: p.name, jobTitle: "Perfumer", url: absoluteUrl(`/perfumers/${p.slug}`) }} />
    </div>
  );
}
