import type * as React from "react";
import { Skeleton } from "@/components/ui";

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-rule-strong px-6 py-10 text-center">
      <p className="font-display text-2xl font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-prose text-sm text-muted">{children}</div>}
    </div>
  );
}

export function ListSkeleton({ rows = 6, label = "Loading" }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-x-8 gap-y-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2 border-t border-rule pt-4">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function HeadingSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="space-y-4 pt-10">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-16 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-10 h-64 w-full" />
    </div>
  );
}
