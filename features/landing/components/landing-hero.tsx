import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import { HeroBoard } from "./hero-board";

// Sets the delay used by the ff-fade-up animation
function delay(ms: number): CSSProperties {
  return { "--ff-delay": `${ms}ms` } as CSSProperties;
}

export function LandingHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative overflow-x-clip px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="ff-fade-up inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          A full-stack project management app
        </div>

        <h1
          className="ff-fade-up mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl"
          style={delay(80)}
        >
          <span className="block">Plan the work.</span>
          <span className="ff-gradient-text inline-block pb-1">
            Ship it together.
          </span>
        </h1>

        <p
          className="ff-fade-up mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg"
          style={delay(160)}
        >
          FlowForge is a project and task management workspace with Kanban
          boards, roles and permissions, email invitations, task comments and a
          full activity history.
        </p>

        <div
          className="ff-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={delay(240)}
        >
          {isLoggedIn ? (
            <Link
              href="/workspace"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/40"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/40"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center rounded-xl border border-slate-300 bg-white/80 px-6 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <p
          className="ff-fade-up mt-4 text-xs text-slate-500"
          style={delay(300)}
        >
          Built with Next.js, TypeScript, Prisma and PostgreSQL
        </p>
      </div>

      <div className="ff-fade-up mt-16" style={delay(420)}>
        <HeroBoard />
      </div>
    </section>
  );
}