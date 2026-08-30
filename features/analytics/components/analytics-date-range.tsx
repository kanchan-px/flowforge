"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Range = 7 | 30;

interface AnalyticsDateRangeProps {
  currentRange: Range;
}

export function AnalyticsDateRange({
  currentRange,
}: AnalyticsDateRangeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleRangeChange(range: Range) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("range", String(range));

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-fit items-center gap-1 rounded-xl border-2 border-blue-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => handleRangeChange(7)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          currentRange === 7
            ? "bg-blue-600 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        7 Days
      </button>

      <button
        type="button"
        onClick={() => handleRangeChange(30)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          currentRange === 30
            ? "bg-blue-600 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        30 Days
      </button>
    </div>
  );
}