import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-md">
        F
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          FlowForge
        </h1>

        <p className="text-sm text-slate-500">
          Project Management
        </p>
      </div>
    </Link>
  );
}