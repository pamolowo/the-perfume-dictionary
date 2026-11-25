import Link from "next/link";
import type { Schemas } from "@tpd/api-client";

type Perfume = Schemas["PerfumeSummary"];

/** A dictionary-style entry: the name leads, house and year follow. */
export function PerfumeEntry({ perfume, headingLevel = 3 }: { perfume: Perfume; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative flex flex-col gap-1 py-4">
      <H className="font-display text-2xl font-semibold leading-tight">
        <Link href={`/perfumes/${perfume.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">
          {perfume.name}
        </Link>
      </H>
      <p className="text-sm text-muted">
        {perfume.brand.name}
        {perfume.release_year ? `, ${perfume.release_year}` : ""}
      </p>
      {perfume.family && <p className="text-xs text-subtle">{perfume.family.name}</p>}
    </article>
  );
}

/** headingLevel: 2 when the list sits directly under the page title, 3 when it sits under a section heading. */
export function PerfumeList({ perfumes, label, headingLevel = 3 }: { perfumes: Perfume[]; label?: string; headingLevel?: 2 | 3 }) {
  return (
    <ul aria-label={label} className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {perfumes.map((p) => (
        <li key={p.id} className="border-t border-rule">
          <PerfumeEntry perfume={p} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
