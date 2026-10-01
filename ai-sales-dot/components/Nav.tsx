"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Dot({ s = 10 }: { s?: number }) { return <span className="pulse inline-block rounded-full bg-dot" style={{ width: s, height: s }} aria-hidden />; }
const items = [["/dashboard", "Dashboard"], ["/dot", "Sales Dot"], ["/leads", "Leads"], ["/settings", "Settings"]];
export default function Nav() {
  const p = usePathname();
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold"><Dot />AI Sales Dot</Link>
        {items.map(([h, l]) => <Link key={h} href={h} className={`text-sm ${p.startsWith(h) ? "font-semibold text-dot" : "text-slate-600 hover:text-ink"}`}>{l}</Link>)}
      </nav>
    </header>
  );
}
