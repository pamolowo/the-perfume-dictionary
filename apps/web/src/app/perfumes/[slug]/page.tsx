import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import type { Schemas } from "@tpd/api-client";
import { AccordBars } from "@/components/accord-bars";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { NotePyramid } from "@/components/note-pyramid";
import { HeadingSkeleton } from "@/components/states";
import { Badge } from "@/components/ui";
import { api, load, loadOptional } from "@/lib/api";
import { concentrationLabel, longDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

const getPerfume = (slug: string) => api.GET("/api/v1/perfumes/{id_or_slug}", { params: { path: { id_or_slug: slug } } });

export async function generateMetadata({ params }: PageProps<"/perfumes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadOptional(getPerfume(slug));
  if (!p) return { title: "Perfume not found", robots: { index: false } };
  const notes = [...p.notes.top, ...p.notes.heart, ...p.notes.base].slice(0, 5).map((n) => n.name).join(", ");
  const description = `${p.name} by ${p.brand.name}${p.release_year ? ` (${p.release_year})` : ""}${p.family ? `, a ${p.family.name.toLowerCase()} fragrance` : ""}.${notes ? ` Notes: ${notes}.` : ""}`;
  return {
    title: `${p.name} by ${p.brand.name}`,
    description,
    alternates: { canonical: `/perfumes/${p.slug}` },
    openGraph: { title: `${p.name} by ${p.brand.name}`, description, url: `/perfumes/${p.slug}` },
    // Fictional sample records must never be indexed as if they were real products.
    robots: p.is_synthetic ? { index: false, follow: true } : undefined,
  };
}

export default function PerfumePage({ params }: PageProps<"/perfumes/[slug]">) {
  return (
    <Suspense fallback={<HeadingSkeleton label="Loading perfume" />}>
      <Perfume params={params} />
    </Suspense>
  );
}

async function Perfume({ params }: Pick<PageProps<"/perfumes/[slug]">, "params">) {
  const { slug } = await params;
  const p = await load(getPerfume(slug));
  return (
    <article className="space-y-16">
      <Breadcrumbs items={[{ name: "Perfumes", href: "/perfumes" }, { name: p.brand.name, href: `/brands/${p.brand.slug}` }, { name: p.name, href: `/perfumes/${p.slug}` }]} />
      <header className="space-y-4">
        <p className="text-sm text-muted">
          <Link href={`/brands/${p.brand.slug}`} className="underline-offset-4 hover:text-accent hover:underline">{p.brand.name}</Link>
        </p>
        <h1 className="font-display text-[clamp(3rem,9vw,6rem)] font-semibold leading-[0.9] tracking-tight">{p.name}</h1>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {p.family && <Meta label="Family"><Link className="hover:text-accent" href={`/perfumes?family=${p.family.slug}`}>{p.family.name}</Link></Meta>}
          {p.release_year && <Meta label="Released">{p.release_year}</Meta>}
          {p.perfumers.length > 0 && (
            <Meta label={p.perfumers.length > 1 ? "Perfumers" : "Perfumer"}>
              {p.perfumers.map((pf, i) => (
                <span key={pf.slug}>{i > 0 && ", "}<Link className="hover:text-accent" href={`/perfumers/${pf.slug}`}>{pf.name}</Link></span>
              ))}
            </Meta>
          )}
          {p.gender_positioning && <Meta label="Marketed as">{p.gender_positioning}</Meta>}
        </dl>
        {p.description && <p className="max-w-prose text-lg text-muted">{p.description}</p>}
        {p.is_synthetic && <Badge tone="sample">Sample record: this perfume is fictional</Badge>}
      </header>

      <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
        <NotePyramid notes={p.notes} />
        <AccordBars accords={p.accords} />
      </div>

      <Bottles variants={p.variants} />
      <Provenance p={p} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          url: absoluteUrl(`/perfumes/${p.slug}`),
          brand: { "@type": "Brand", name: p.brand.name },
          category: "Fragrance",
          ...(p.description ? { description: p.description } : {}),
          ...(p.release_year ? { releaseDate: String(p.release_year) } : {}),
          ...(p.variants.some((v) => v.gtin) ? { gtin: p.variants.find((v) => v.gtin)!.gtin } : {}),
        }}
      />
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="first-letter:uppercase">{children}</dd>
    </div>
  );
}

function Bottles({ variants }: { variants: Schemas["VariantOut"][] }) {
  return (
    <section aria-labelledby="bottles-h" className="max-w-xl space-y-4">
      <h2 id="bottles-h" className="font-display text-3xl font-semibold">Bottles</h2>
      {variants.length === 0 ? (
        <p className="text-sm text-muted">No bottle sizes recorded yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-y border-rule">
          {variants.map((v) => (
            <li key={v.id} className="flex items-baseline justify-between gap-4 py-3">
              <span>{concentrationLabel(v.concentration)}{v.edition ? `, ${v.edition}` : ""}</span>
              <span className="tabular text-muted">{v.volume_ml} ml</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Provenance({ p }: { p: Schemas["PerfumeDetail"] }) {
  return (
    <aside aria-label="About this record" className="rounded-md bg-sunk px-5 py-4 text-sm text-muted">
      <p>
        Source: {p.data_source?.name ?? "not recorded"}.{" "}
        {p.last_verified_at ? <>Last verified <time dateTime={p.last_verified_at}>{longDate(p.last_verified_at)}</time>.</> : "Not yet verified against an official source."}
      </p>
    </aside>
  );
}
