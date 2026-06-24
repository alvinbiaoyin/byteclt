// app/(marketing)/page.tsx
// BYTEclt · Biomarker Intelligence — landing page (v2 productization).
// Composes the six information-architecture sections. Static layout only.
// No animations, no real dashboard rendering, no LLM, no new APIs.

import type { Metadata } from "next";
import SectionHero from "./components/section-hero";
import SectionIntelligenceLayer from "./components/section-intelligence-layer";
import SectionPlatformPreview from "./components/section-platform-preview";
import SectionMarketReality from "./components/section-market-reality";
import SectionByte from "./components/section-byte";
import SectionSelectedWork from "./components/section-selected-work";
import SectionAdjacentCare from "./components/section-adjacent-care";

export const metadata: Metadata = {
  title: "BYTEclt · Biomarker Testing Intelligence Across Real Clinical Settings",
  description:
    "Supporting companion diagnostics, testing strategy, testing adoption, reimbursement status, and treatment pathway understanding across precision medicine markets.",
};

export default function MarketingHomePage() {
  return (
    <>
      <SectionHero />
      <SectionIntelligenceLayer />
      <SectionPlatformPreview />
      <SectionMarketReality />
      <SectionByte />
      <SectionSelectedWork />
      <SectionAdjacentCare />
    </>
  );
}
