import {
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  TriangleAlert,
} from "lucide-react";

interface AnalyticsStatsProps {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export function AnalyticsStats({
  totalProjects,
  totalTasks,
  completedTasks,
  overdueTasks,
}: AnalyticsStatsProps) {
  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      iconClassName: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ClipboardList,
      iconClassName: "bg-slate-100 text-slate-600",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Overdue Tasks",
      value: overdueTasks,
      icon: TriangleAlert,
      iconClassName: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${stat.iconClassName}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}