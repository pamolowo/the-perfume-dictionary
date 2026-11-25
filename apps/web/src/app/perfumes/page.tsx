import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import type { paths } from "@tpd/api-client";
import { ExpiredLink } from "@/components/expired-link";
import { Pagination } from "@/components/pagination";
import { PerfumeList } from "@/components/perfume-entry";
import { EmptyState, ListSkeleton } from "@/components/states";
import { Input, NativeSelect, PageHeading, buttonClass } from "@/components/ui";
import { api, loadOptional, loadPage } from "@/lib/api";
import { CONCENTRATIONS, concentrationLabel, one } from "@/lib/format";
import { SORTS, cleanFilters, type SP } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Perfumes",
  description: "Browse and filter perfumes by name, house, note, accord, family, perfumer, concentration and year.",
  alternates: { canonical: "/perfumes" },
};

export default function PerfumesPage({ searchParams }: PageProps<"/perfumes">) {
  return (
    <div className="space-y-10">
      <PageHeading title="Perfumes" />
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <Suspense fallback={<div className="h-96 rounded-md bg-sunk" aria-hidden />}>
          <Filters searchParams={searchParams} />
        </Suspense>
        <div className="min-w-0 space-y-8">
          <Suspense fallback={<ListSkeleton rows={9} label="Loading perfumes" />}>
            <Results searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function Filters({ searchParams }: { searchParams: Promise<SP> }) {
  const f = cleanFilters(await searchParams);
  const [families, brands, accords] = await Promise.all([
    loadOptional(api.GET("/api/v1/families")),
    loadOptional(api.GET("/api/v1/brands", { params: { query: { limit: 100 } } })),
    loadOptional(api.GET("/api/v1/accords")),
  ]);
  return (
    <form action="/perfumes" aria-label="Filter perfumes" className="space-y-5 lg:sticky lg:top-6 lg:self-start">
      <Field id="f-q" label="Name">
        <Input id="f-q" name="q" type="search" defaultValue={f.q} />
      </Field>
      <Field id="f-note" label="Contains note">
        <Input id="f-note" name="note" defaultValue={f.note} placeholder="e.g. vetiver or orris" />
      </Field>
      <Field id="f-accord" label="Accord">
        <NativeSelect id="f-accord" name="accord" defaultValue={f.accord ?? ""}>
          <option value="">Any accord</option>
          {accords?.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
        </NativeSelect>
      </Field>
      <Field id="f-family" label="Family">
        <NativeSelect id="f-family" name="family" defaultValue={f.family ?? ""}>
          <option value="">Any family</option>
          {families?.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}
        </NativeSelect>
      </Field>
      <Field id="f-brand" label="House">
        <NativeSelect id="f-brand" name="brand" defaultValue={f.brand ?? ""}>
          <option value="">Any house</option>
          {brands?.data.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </NativeSelect>
      </Field>
      <Field id="f-conc" label="Concentration">
        <NativeSelect id="f-conc" name="concentration" defaultValue={f.concentration ?? ""}>
          <option value="">Any concentration</option>
          {CONCENTRATIONS.map((c) => <option key={c} value={c}>{concentrationLabel(c)}</option>)}
        </NativeSelect>
      </Field>
      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">Released</legend>
        <div className="flex items-center gap-2">
          <label htmlFor="f-from" className="sr-only">From year</label>
          <Input id="f-from" name="year_from" inputMode="numeric" pattern="[0-9]{4}" placeholder="From" defaultValue={f.year_from} />
          <span aria-hidden className="text-subtle">–</span>
          <label htmlFor="f-to" className="sr-only">To year</label>
          <Input id="f-to" name="year_to" inputMode="numeric" pattern="[0-9]{4}" placeholder="To" defaultValue={f.year_to} />
        </div>
      </fieldset>
      <Field id="f-sort" label="Sort by">
        <NativeSelect id="f-sort" name="sort" defaultValue={f.sort ?? "name"}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </NativeSelect>
      </Field>
      {f.perfumer && <input type="hidden" name="perfumer" value={f.perfumer} />}
      <div className="flex gap-3">
        <button type="submit" className={buttonClass()}>Apply filters</button>
        <Link href="/perfumes" className={buttonClass("ghost")}>Clear</Link>
      </div>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

type PerfumeQuery = NonNullable<paths["/api/v1/perfumes"]["get"]["parameters"]["query"]>;

async function Results({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters = cleanFilters(sp);
  const cursor = one(sp.cursor);
  const query = { ...filters, limit: 18, ...(cursor ? { cursor } : {}) } as unknown as PerfumeQuery;
  const res = await loadPage(() => api.GET("/api/v1/perfumes", { params: { query } }), !!cursor);
  if (res === "bad-cursor") return <ExpiredLink href="/perfumes" />;
  const active = Object.keys(filters).filter((k) => k !== "sort").length;

  return (
    <>
      <p className="text-sm text-muted" aria-live="polite">
        {res.data.length === 0
          ? "No perfumes match."
          : `Showing ${res.data.length} perfume${res.data.length === 1 ? "" : "s"}${active ? ` matching ${active} filter${active === 1 ? "" : "s"}` : ""}${cursor ? " (continued)" : ""}.`}
      </p>
      {res.data.length === 0 ? (
        <EmptyState title="Nothing matches those filters">
          Try fewer filters, another spelling, or a note&apos;s other name. <Link href="/perfumes" className="underline">Clear all filters</Link>.
        </EmptyState>
      ) : (
        <PerfumeList perfumes={res.data} label="Perfumes" headingLevel={2} />
      )}
      <Pagination path="/perfumes" params={filters} cursor={cursor} next={res.page.next_cursor} />
    </>
  );
}
