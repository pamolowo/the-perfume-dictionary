import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PerfumeList } from "@/components/perfume-entry";
import { EmptyState, HeadingSkeleton } from "@/components/states";
import { Badge, PageHeading } from "@/components/ui";
import { api, load, loadOptional } from "@/lib/api";
import { countryName } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

const getBrand = (slug: string) => api.GET("/api/v1/brands/{slug}", { params: { path: { slug } } });

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const b = await loadOptional(getBrand((await params).slug));
  if (!b) return { title: "House not found", robots: { index: false } };
  return {
    title: `${b.name} perfumes`,
    description: `All ${b.perfume_count} ${b.name} perfumes in the dictionary${b.country ? `, from ${countryName(b.country)}` : ""}.`,
    alternates: { canonical: `/brands/${b.slug}` },
    robots: b.is_synthetic ? { index: false, follow: true } : undefined,
  };
}

export default function BrandPage({ params }: PageProps<"/brands/[slug]">) {
  return (
    <Suspense fallback={<HeadingSkeleton label="Loading house" />}>
      <Brand params={params} />
    </Suspense>
  );
}

async function Brand({ params }: Pick<PageProps<"/brands/[slug]">, "params">) {
  const b = await load(getBrand((await params).slug));
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ name: "Houses", href: "/brands" }, { name: b.name, href: `/brands/${b.slug}` }]} />
      <PageHeading eyebrow={countryName(b.country) ?? "Perfume house"} title={b.name}>
        {b.perfume_count} perfume{b.perfume_count === 1 ? "" : "s"} in the dictionary.
      </PageHeading>
      {b.is_synthetic && <Badge tone="sample">Sample record: this house is fictional</Badge>}
      {b.perfumes.length ? <PerfumeList perfumes={b.perfumes} label={`${b.name} perfumes`} headingLevel={2} /> : <EmptyState title="No perfumes listed yet" />}
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Brand", name: b.name, url: absoluteUrl(`/brands/${b.slug}`) }} />
    </div>
  );
}
