import Link from "next/link";
import { buttonClass } from "@/components/ui";

/**
 * Cursor pagination links. `params` are the current filters (without cursor); `next` is the API's next_cursor.
 * Cursors are opaque, so there's "first page" and "next page" rather than numbered pages.
 */
export function Pagination({ path, params, cursor, next }: { path: string; params: Record<string, string>; cursor?: string; next?: string | null }) {
  const qs = (extra: Record<string, string>) => {
    const s = new URLSearchParams({ ...params, ...extra }).toString();
    return s ? `${path}?${s}` : path;
  };
  if (!cursor && !next) return null;
  return (
    <nav aria-label="Pagination" className="flex gap-3">
      {cursor && <Link className={buttonClass("outline")} href={qs({})}>Back to first page</Link>}
      {next && <Link className={buttonClass("outline")} href={qs({ cursor: next })} rel="next">Next page</Link>}
    </nav>
  );
}
