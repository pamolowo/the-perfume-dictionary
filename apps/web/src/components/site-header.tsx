import Link from "next/link";

export const NAV = [
  { href: "/perfumes", label: "Perfumes" },
  { href: "/notes", label: "Notes" },
  { href: "/accords", label: "Accords" },
  { href: "/brands", label: "Houses" },
  { href: "/perfumers", label: "Perfumers" },
];

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

/** Works without JavaScript: the mobile menu is a native <details> disclosure. */
export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-[max(1rem,env(safe-area-inset-left))]">
        <Link href="/" className="-my-2 py-2 font-display text-[1.45rem] font-semibold leading-none tracking-tight">
          The Perfume Dictionary
        </Link>
        <nav aria-label="Main" className="ml-auto hidden items-center gap-6 text-sm md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="-my-2 inline-block py-2 text-muted hover:text-foreground">{n.label}</Link>
          ))}
          <form action="/search" role="search" className="relative">
            <label htmlFor="header-q" className="sr-only">Search perfumes, notes and houses</label>
            <SearchIcon />
            <input id="header-q" name="q" type="search" placeholder="Search" required
              className="h-9 w-44 rounded-full border border-rule-strong bg-surface pl-9 pr-3 text-sm placeholder:text-subtle lg:w-56" />
          </form>
        </nav>
        <details className="group relative ml-auto md:hidden">
          <summary className="cursor-pointer list-none rounded-full px-3 py-2 text-sm font-medium hover:bg-sunk [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <div className="absolute right-0 top-12 z-20 w-[min(20rem,calc(100vw-2rem))] space-y-4 rounded-md border border-rule bg-surface p-4 shadow-lg">
            <form action="/search" role="search">
              <label htmlFor="mobile-q" className="sr-only">Search perfumes, notes and houses</label>
              <input id="mobile-q" name="q" type="search" placeholder="Search perfumes, notes, houses" required
                className="h-11 w-full rounded-full border border-rule-strong bg-surface px-4 text-base" />
            </form>
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="border-b border-rule py-3 font-display text-2xl last:border-0">{n.label}</Link>
              ))}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
