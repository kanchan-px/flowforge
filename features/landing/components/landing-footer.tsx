import { Logo } from "@/components/shared/logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <Logo />

        <p>A personal project built with Next.js, Prisma and PostgreSQL.</p>

        <a
          href="https://github.com/kanchan-px/flowforge"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-700 transition hover:text-blue-600"
        >
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}