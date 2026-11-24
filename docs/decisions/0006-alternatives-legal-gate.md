# 0006 — "Similar Perfumes" instead of "Dupes" / "Inspired by"

Status: accepted (owner decision, 2026-11-23) — launch still subject to legal review

**Context.** "Dupe" and "inspired by" wording that names a brand's perfume to sell or promote another product carries
trade mark and comparative-advertising risk in the UK/EU (e.g. L'Oréal v Bellure). Factual, non-commercial
similarity information is lower risk but still needs review.

**Decision.** The feature is **Similar Perfumes** ("similar scent profile"):
- Results come from factual catalogue data (notes, accords, families) with a similarity score, the model version
  and a confidence level, and are labelled as algorithmic suggestions.
- No "dupe", "clone", "smells like", "inspired by" or "alternative to" labels; no claims about quality equivalence.
- Price may filter or sort results, but never affects the similarity score; sponsored placements are never mixed in.
- Built in Phase 5 behind a feature flag; switched on publicly only after legal sign-off.

**Consequences.** Accords are stored per perfume from Phase 1 (`perfume_accords`) so similarity has factual inputs.
