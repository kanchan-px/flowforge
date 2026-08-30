"use client";

import { TrendingUp } from "lucide-react";

interface ProductivityTrendItem {
  date: string;
  completedTasks: number;
}

interface AnalyticsProductivityTrendProps {
  trend: ProductivityTrendItem[];
  days: 7 | 30;
}

function formatDay(date: string, days: 7 | 30) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-US", {
    weekday: days === 7 ? "short" : undefined,
    month: days === 30 ? "short" : undefined,
    day: days === 30 ? "numeric" : undefined,
  });
}

function formatFullDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AnalyticsProductivityTrend({
  trend,
  days,
}: AnalyticsProductivityTrendProps) {
  const maxCompletedTasks = Math.max(
    ...trend.map((item) => item.completedTasks),
    1,
  );

  const totalCompletedTasks = trend.reduce(
    (total, item) => total + item.completedTasks,
    0,
  );

  const rangeLabel = `${days}-day`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Productivity Trend
            </h2>

            <p className="text-sm text-slate-500">
              Tasks completed over the last {days} days
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="hidden text-right sm:block">
          <p className="text-xs text-slate-400">
            {rangeLabel} total
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {totalCompletedTasks}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {trend.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">
            No productivity data available yet.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          {/* Mobile total */}
          <div className="mb-5 flex items-center justify-between sm:hidden">
            <span className="text-xs text-slate-400">
              {rangeLabel} total
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {totalCompletedTasks}{" "}
              {totalCompletedTasks === 1 ? "task" : "tasks"} completed
            </span>
          </div>

          {/* Chart */}
          <div
            className={`flex h-64 items-end ${
              days === 30 ? "gap-1 sm:gap-2" : "gap-2 sm:gap-4"
            }`}
          >
            {trend.map((item) => {
              const height =
                item.completedTasks === 0
                  ? 0
                  : Math.max(
                      (item.completedTasks / maxCompletedTasks) * 100,
                      8,
                    );

              return (
                <div
                  key={item.date}
                  className="group flex h-full flex-1 flex-col items-center justify-end"
                >
                  {/* Count */}
                  <div
                    className={`mb-2 text-xs font-semibold text-slate-600 ${
                      days === 30 ? "hidden sm:block" : ""
                    }`}
                  >
                    {item.completedTasks}
                  </div>

                  {/* Bar area */}
                  <div className="relative flex h-full w-full items-end justify-center">
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                      <p className="font-semibold">
                        {item.completedTasks}{" "}
                        {item.completedTasks === 1
                          ? "task"
                          : "tasks"}
                      </p>

                      <p className="mt-1 text-slate-300">
                        {formatFullDate(item.date)}
                      </p>
                    </div>

                    {/* Bar */}
                    {item.completedTasks > 0 ? (
                      <div
                        className={`rounded-t-xl bg-blue-500 transition-all duration-300 group-hover:bg-blue-600 ${
                          days === 30
                            ? "w-full max-w-6"
                            : "w-full max-w-12"
                        }`}
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    ) : (
                      <div
                        className={`w-full rounded-full border border-dashed border-slate-200 ${
                          days === 30 ? "max-w-6" : "max-w-12"
                        }`}
                      />
                    )}
                  </div>

                  {/* Day */}
                  <span
                    className={`mt-3 text-xs font-medium text-slate-400 ${
                      days === 30
                        ? "hidden sm:block"
                        : ""
                    }`}
                  >
                    {formatDay(item.date, days)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 30-day hint */}
          {days === 30 && (
            <p className="mt-4 text-center text-xs text-slate-400 sm:hidden">
              Hover over a bar to see the date and completed tasks.
            </p>
          )}
        </div>
      )}
    </div>
  );
}