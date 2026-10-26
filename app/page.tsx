import type { Metadata } from "next";

import { getSession } from "@/lib/session";

import { LandingBackground } from "@/features/landing/components/landing-background";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { LandingFeatures } from "@/features/landing/components/landing-features";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { LandingSteps } from "@/features/landing/components/landing-steps";

export const metadata: Metadata = {
  title: { absolute: "FlowForge | Plan the work. Ship it together." },
  description:
    "FlowForge is a project and task management app with Kanban boards, roles and permissions, email invitations, task comments and activity history.",
  openGraph: {
    title: "FlowForge | Plan the work. Ship it together.",
    description:
      "Kanban boards, roles, email invitations, comments and activity history in one workspace.",
    type: "website",
  },
};

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = Boolean(session);

  return (
    <div className="relative isolate min-h-screen bg-white text-slate-900">
      <LandingBackground />

      <LandingNav isLoggedIn={isLoggedIn} />

      <main>
        <LandingHero isLoggedIn={isLoggedIn} />
        <LandingFeatures />
        <LandingSteps />
        <LandingCta isLoggedIn={isLoggedIn} />
      </main>

      <LandingFooter />
    </div>
  );
}