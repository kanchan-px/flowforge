import Link from "next/link";

export function LandingCta({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="ff-reveal relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-600 to-violet-600 px-6 py-16 text-center text-white shadow-xl shadow-blue-600/20 sm:px-12">
        <div
          aria-hidden="true"
          className="ff-blob absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="ff-blob absolute -bottom-12 -right-8 h-64 w-64 rounded-full bg-violet-300/20 blur-2xl"
          style={{ animationDelay: "-6s" }}
        />

        <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to organise your next project?
        </h2>

        <p className="relative mx-auto mt-4 max-w-xl text-blue-100">
          Create an account, start a project and invite your team.
        </p>

        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isLoggedIn ? (
            <Link
              href="/workspace"
              className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-base font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-base font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Create an account
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-12 items-center rounded-xl border border-white/40 px-6 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}