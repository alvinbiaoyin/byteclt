"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Top nav stays diagnostics-first. "Platform" is the Jianji CDx™ product
// page; "Intelligence" points at the editorial observations page, not the
// interactive dashboard. The CDx dashboard lives at /intel and is reached via
// the "Open CDx Platform" CTA on the right. Jianji Care™ is intentionally
// kept out of the top nav and surfaced via the footer and the lower-page
// adjacent-capability section instead.
const NAV_ITEMS = [
  { href: "/platform", label: "Platform" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand block */}
        <Link
          href="/"
          prefetch={false}
          className="group flex flex-col leading-tight"
          aria-label="BYTEclt · Biomarker Intelligence — Home"
        >
          <span className="text-[13px] font-semibold tracking-[0.26em] text-slate-100 transition-colors group-hover:text-cyan-200">
            BYTEclt
          </span>
          <span className="mt-0.5 text-[9px] font-mono uppercase tracking-[0.25em] text-slate-500">
            Biomarker Intelligence
          </span>
        </Link>

        {/* Primary nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`text-[11px] font-mono uppercase tracking-[0.2em] transition-colors ${
                  active
                    ? "text-cyan-200"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA — opens the live Jianji CDx™ dashboard. */}
        <Link
          href="/intel"
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-200 transition-colors hover:border-cyan-400/70 hover:bg-cyan-900/40 hover:text-cyan-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Open CDx Platform
        </Link>
      </div>
    </header>
  );
}
