import Link from "next/link";
import { Suspense } from "react";
import { api, loadOptional } from "@/lib/api";
import { NAV } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-sunk">
      <div className="mx-auto grid max-w-6xl gap-8 px-[max(1rem,env(safe-area-inset-left))] py-12 text-sm text-muted md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="font-display text-2xl font-semibold text-foreground">The Perfume Dictionary</p>
          <p className="max-w-prose">Discover the scent. Understand the fragrance. Compare the price.</p>
        </div>
        <nav aria-label="Explore" className="flex flex-col gap-2">
          <Link href="/search" className="hover:text-foreground">Search</Link>
          {NAV.map((n) => <Link key={n.href} href={n.href} className="hover:text-foreground">{n.label}</Link>)}
        </nav>
        <div className="space-y-2 text-subtle">
          <p>Preview build. Every perfume, house and perfumer shown is fictional sample data.</p>
          <Suspense fallback={<p>Checking the API…</p>}>
            <BuildInfo />
          </Suspense>
        </div>
      </div>
    </footer>
  );
}

/** Which API build this page was rendered against — handy for checking a deployment. */
async function BuildInfo() {
  const meta = await loadOptional(api.GET("/api/v1/meta"));
  if (!meta) return <p role="status">The catalogue API isn&apos;t reachable right now.</p>;
  return (
    <p role="status" className="tabular">
      Connected to API {meta.version} ({meta.git_sha.slice(0, 7)}) in {meta.environment}.
    </p>
  );
}
