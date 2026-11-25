import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail plus the matching BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="pt-6 text-sm text-muted">
        <ol className="flex flex-wrap gap-x-2">
          {items.map((c, i) => (
            <li key={c.href} className="flex gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i === items.length - 1 ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link href={c.href} className="underline-offset-4 hover:text-accent hover:underline">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
        }}
      />
    </>
  );
}
