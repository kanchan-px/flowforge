import { BarChart3 } from "lucide-react";

import { AnalyticsActivity } from "@/features/analytics/components/analytics-activity";
import { AnalyticsBreakdown } from "@/features/analytics/components/analytics-breakdown";
import { AnalyticsDateRange } from "@/features/analytics/components/analytics-date-range";
import { AnalyticsProductivityTrend } from "@/features/analytics/components/analytics-productivity-trend";
import { AnalyticsProjects } from "@/features/analytics/components/analytics-projects";
import { AnalyticsStats } from "@/features/analytics/components/analytics-stats";
import { getAnalytics } from "@/features/analytics/queries/get-analytics";

interface AnalyticsPageProps {
  searchParams: Promise<{
    range?: string;
  }>;
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = await searchParams;

  const range: 7 | 30 = params.range === "30" ? 30 : 7;

  const analytics = await getAnalytics(range);

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
       <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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

    <AnalyticsDateRange currentRange={range} />
  </div>

      {/* Statistics */}
      <AnalyticsStats
        totalProjects={analytics.overview.totalProjects}
        totalTasks={analytics.overview.totalTasks}
        completedTasks={analytics.overview.completedTasks}
        overdueTasks={analytics.overview.overdueTasks}
      />

      {/* Productivity Trend */}
      <AnalyticsProductivityTrend trend={analytics.trend} days={range} />

      {/* Completion Rate */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Completion Rate</p>

        <p className="mt-2 text-4xl font-bold text-slate-900">
          {analytics.overview.completionRate}%
        </p>
      </div>

      {/* Task Breakdown */}
      <AnalyticsBreakdown
        todoTasks={analytics.overview.todoTasks}
        inProgressTasks={analytics.overview.inProgressTasks}
        completedTasks={analytics.overview.completedTasks}
        highPriorityTasks={analytics.priority.high}
        mediumPriorityTasks={analytics.priority.medium}
        lowPriorityTasks={analytics.priority.low}
      />

      {/* Project Performance */}
      <AnalyticsProjects projects={analytics.projects} />

      {/* Recent Activity */}
      <AnalyticsActivity activities={analytics.recentActivity} />
    </div>
  );
}
