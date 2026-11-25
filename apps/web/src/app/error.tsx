"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div role="alert" className="max-w-prose space-y-4 pt-20">
      <h1 className="font-display text-5xl font-semibold">The catalogue isn&apos;t responding</h1>
      <p className="text-muted">We couldn&apos;t load this page because the catalogue service didn&apos;t answer. Your link is fine. Try again in a moment.</p>
      <button type="button" onClick={reset} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Try again</button>
    </div>
  );
}
