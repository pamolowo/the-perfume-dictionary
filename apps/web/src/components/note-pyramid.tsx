import Link from "next/link";
import type { Schemas } from "@tpd/api-client";

const TIERS = [
  { key: "top", label: "Top notes", hint: "the first impression, gone within the hour" },
  { key: "heart", label: "Heart notes", hint: "the character, for the next few hours" },
  { key: "base", label: "Base notes", hint: "what lingers on skin" },
] as const;

/** The scent pyramid as three bands, narrowest (top) to widest (base), so the shape reads as a pyramid. */
export function NotePyramid({ notes }: { notes: Schemas["Pyramid"] }) {
  return (
    <section aria-labelledby="pyramid-h" className="space-y-4">
      <h2 id="pyramid-h" className="font-display text-3xl font-semibold">Notes</h2>
      <ol className="flex flex-col items-center gap-1.5">
        {TIERS.map((t, i) => {
          const list = notes[t.key] ?? [];
          const width = ["sm:w-[64%]", "sm:w-[82%]", "sm:w-full"][i];
          return (
            <li key={t.key} className={`w-full ${width} rounded-sm bg-sunk px-5 py-4`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-xl font-semibold">{t.label}</h3>
                <p className="text-xs text-subtle">{t.hint}</p>
              </div>
              {list.length ? (
                <ul aria-label={t.label} className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {list.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/notes/${n.slug}`} className="text-[15px] underline decoration-rule-strong underline-offset-4 hover:text-accent hover:decoration-accent">
                        {n.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-subtle">Not listed</p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
