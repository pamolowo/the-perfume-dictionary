import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/states";
import { PageHeading } from "@/components/ui";
import { api, load } from "@/lib/api";

export const metadata: Metadata = {
  title: "Accords",
  description: "The main scent accords, from woody and citrus to gourmand and leather, and the perfumes where each stands out.",
  alternates: { canonical: "/accords" },
};

export default function AccordsPage() {
  return (
    <div className="space-y-10">
      <PageHeading title="Accords">
        An accord is the overall impression several notes create together: woody, citrus, powdery. It&apos;s the quickest
        way to describe what a perfume smells like.
      </PageHeading>
      <Suspense fallback={<ListSkeleton rows={9} label="Loading accords" />}>
        <Accords />
      </Suspense>
    </div>
  );
}

async function Accords() {
  const accords = await load(api.GET("/api/v1/accords"));
  return (
    <ul aria-label="Accords" className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {accords.map((a) => (
        <li key={a.slug} className="group relative border-t border-rule py-4">
          <h2 className="font-display text-2xl font-semibold">
            <Link href={`/accords/${a.slug}`} className="after:absolute after:inset-0 group-hover:text-accent">{a.name}</Link>
          </h2>
          {a.description && <p className="text-sm text-muted">{a.description}</p>}
        </li>
      ))}
    </ul>
  );
}
