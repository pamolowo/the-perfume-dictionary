import Link from "next/link";
import { EmptyState } from "@/components/states";

export function ExpiredLink({ href }: { href: string }) {
  return (
    <EmptyState title="That page link has expired">
      Page links change when the catalogue is updated. <Link href={href} className="underline">Start from the first page</Link>.
    </EmptyState>
  );
}
