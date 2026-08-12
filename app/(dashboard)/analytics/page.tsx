import { BarChart3 } from "lucide-react";

import { getAnalytics } from "@/features/analytics/queries/get-analytics";

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Analytics
            </h1>

            <p className="mt-1 text-slate-500">
              Track your productivity and project progress
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Projects
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analytics.overview.totalProjects}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {analytics.overview.totalTasks}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Completed Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {analytics.overview.completedTasks}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Overdue Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {analytics.overview.overdueTasks}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Completion Rate
        </p>

        <p className="mt-2 text-4xl font-bold text-slate-900">
          {analytics.overview.completionRate}%
        </p>
      </div>
    </div>
  );
}