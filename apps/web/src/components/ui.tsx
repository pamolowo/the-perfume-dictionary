import type * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
const BUTTON = "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-medium transition-colors";
const VARIANT: Record<ButtonVariant, string> = {
  solid: "bg-foreground text-background hover:bg-foreground/85",
  outline: "border border-rule-strong bg-surface hover:bg-sunk",
  ghost: "hover:bg-sunk",
};
/** Button styling, also applied to links that look like buttons. */
export const buttonClass = (variant: ButtonVariant = "solid", className?: string) => cn(BUTTON, VARIANT[variant], className);

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-10 w-full min-w-0 rounded-md border border-rule-strong bg-surface px-3 text-sm placeholder:text-subtle", className)}
      {...props}
    />
  );
}

export function NativeSelect({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-10 w-full min-w-0 rounded-md border border-rule-strong bg-surface px-3 text-sm", className)} {...props} />;
}

export function Badge({ className, tone = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "sample" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "sample" ? "bg-accent-wash text-foreground" : "border border-rule-strong text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-sunk", className)} />;
}

export function PageHeading({ eyebrow, title, children }: { eyebrow?: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <header className="space-y-3 pt-10">
      {eyebrow && <p className="text-sm text-muted">{eyebrow}</p>}
      <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-tight">{title}</h1>
      {children && <div className="max-w-prose text-lg text-muted">{children}</div>}
    </header>
  );
}
