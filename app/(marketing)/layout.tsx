// app/(marketing)/layout.tsx
// Marketing route-group layout. Wraps "/", "/platform", "/jianji-care",
// "/about", "/contact", and related marketing pages with shared nav + footer.
// The dashboard at /intel sits OUTSIDE this group and is unaffected.

import type { ReactNode } from "react";
import MarketingNav from "./components/marketing-nav";
import MarketingFooter from "./components/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
