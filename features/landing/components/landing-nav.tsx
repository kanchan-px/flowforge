import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav
          aria-label="Page sections"
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
        >
          <a href="#features" className="transition hover:text-slate-900">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-slate-900">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/workspace"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}