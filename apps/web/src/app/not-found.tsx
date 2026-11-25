import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-prose space-y-4 pt-20">
      <h1 className="font-display text-5xl font-semibold">Not in the dictionary</h1>
      <p className="text-muted">There&apos;s no page at this address. It may have been renamed, or the link has a typo.</p>
      <p className="flex gap-4">
        <Link href="/perfumes" className="underline underline-offset-4">Browse perfumes</Link>
        <Link href="/notes" className="underline underline-offset-4">Browse notes</Link>
      </p>
    </div>
  );
}
