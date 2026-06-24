"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Diagnostics-first navigation. Jianji CDx leads; Jianji Care is visible but
// not louder than the CDx Platform CTA. The live CDx dashboard is at /intel.
const NAV_ITEMS = [
  { href: "/platform", label: "Jianji CDx" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/jianji-care", label: "Jianji Care" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function MarketingNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          prefetch={false}
          className="group flex min-w-0 flex-col leading-tight"
          aria-label="BYTEclt · BYTE Healthcare Consulting — Home"
        >
          <span className="text-[13px] font-semibold tracking-[0.26em] text-slate-100 transition-colors group-hover:text-cyan-200">
            BYTEclt
          </span>
          <span className="mt-0.5 text-[9px] font-mono uppercase tracking-[0.25em] text-slate-500">
            BYTE Healthcare Consulting
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`text-[11px] font-mono uppercase tracking-[0.2em] transition-colors ${
                isActive(item.href)
                  ? "text-cyan-200"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/intel"
            prefetch={false}
            className="hidden sm:inline-flex items-center gap-2 rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-200 transition-colors hover:border-cyan-400/70 hover:bg-cyan-900/40 hover:text-cyan-100"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Open CDx Platform
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm border border-slate-800 px-2.5 py-2 text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-100 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
              Menu
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-slate-800/60 bg-slate-950 px-6 py-4 lg:hidden"
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors ${
                    isActive(item.href)
                      ? "text-cyan-200"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/intel"
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-3 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Open CDx Platform
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
