import Link from "next/link";

// Marketing footer.
// Single left-aligned block: brand · positioning line · contact details ·
// inline nav · quiet copyright. No columns, no social icons, no
// newsletter. Institutional, restrained.

const FOOTER_NAV = [
  { href: "/platform", label: "Platform" },
  { href: "/intel", label: "Intelligence" },
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
          Commercial insights for biomarker testing and companion
          diagnostics across Asia-Pacific precision medicine markets.
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
