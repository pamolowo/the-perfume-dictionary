import Link from "next/link";
import type { Schemas } from "@tpd/api-client";

/** Describes a 1–100 strength in words, so the bar isn't the only way to read it. */
export function strengthWord(strength: number) {
  if (strength >= 80) return "dominant";
  if (strength >= 55) return "prominent";
  if (strength >= 30) return "noticeable";
  return "subtle";
}

/** Main accords as labelled bars. Strengths are editorial/source data, never presented as measurements. */
export function AccordBars({ accords }: { accords: Schemas["PerfumeAccordOut"][] }) {
  return (
    <section aria-labelledby="accords-h" className="space-y-4">
      <h2 id="accords-h" className="font-display text-3xl font-semibold">Main accords</h2>
      {accords.length === 0 ? (
        <p className="text-sm text-muted">No accords recorded yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {accords.map((a) => (
            <li key={a.slug} className="grid grid-cols-[8rem_1fr_5.5rem] items-center gap-3 text-sm">
              <Link href={`/accords/${a.slug}`} className="hover:text-accent">{a.name}</Link>
              <span aria-hidden className="h-2 rounded-full bg-champagne" style={{ width: `${Math.max(4, a.strength)}%` }} />
              <span className="text-xs text-subtle">{strengthWord(a.strength)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-subtle">Relative prominence within this perfume, from catalogue data. Not a lab measurement.</p>
    </section>
  );
}
