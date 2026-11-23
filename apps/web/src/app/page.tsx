import { Suspense } from "react";
import { api } from "@/lib/api";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-10 px-[max(1rem,env(safe-area-inset-left))] py-20">
      <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
        The Perfume Dictionary
      </h1>
      <p className="max-w-prose text-lg text-muted">
        Discover the scent. Understand the fragrance. Compare the price. The catalogue arrives in Phase 1; this page
        proves the pipeline from code to cluster works.
      </p>
      <Suspense fallback={<p className="text-sm text-subtle">Checking the API…</p>}>
        <ApiStatus />
      </Suspense>
    </main>
  );
}

async function ApiStatus() {
  const meta = await api.GET("/api/v1/meta").then((r) => (r.response.ok ? r.data : undefined)).catch(() => undefined);
  if (!meta) {
    return <p role="status" className="text-sm text-accent">The API isn&apos;t reachable yet.</p>;
  }
  return (
    <p role="status" className="text-sm text-muted">
      Connected to API {meta.version} ({meta.git_sha.slice(0, 7)}) in {meta.environment}.
    </p>
  );
}
