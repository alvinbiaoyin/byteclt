import Link from "next/link";

// Marketing footer.
// Single left-aligned block: brand · positioning line · contact details ·
// inline nav · quiet copyright. No columns, no social icons, no
// newsletter. Institutional, restrained.

// "Platform" points at the Jianji CDx™ product page; "Intelligence" at the
// editorial observations page. Jianji Care™ is surfaced here (rather than in
// the top nav) so it stays accessible without competing with the core CDx
// positioning.
const FOOTER_NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/care", label: "Jianji Care™" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-medium tracking-tight text-zinc-200">
          BYTEclt
        </p>

        <p className="mt-3 max-w-md text-sm leading-7 text-zinc-500">
          Commercial insights for biomarker testing, companion diagnostics,
          and selected healthcare supplier intelligence across Asia-Pacific
          markets.
        </p>

        <div className="mt-8 space-y-1 text-sm text-zinc-500">
          <p>Shanghai, China</p>
          <p>alvin.yin@byteclt.com</p>
          <p>(+86) 134 8209 6741</p>
        </div>

        <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {FOOTER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-12 text-xs text-zinc-600">
          © {new Date().getFullYear()} BYTEclt · 沪ICP备14016076号-1
        </p>
      </div>
    </footer>
  );
}
