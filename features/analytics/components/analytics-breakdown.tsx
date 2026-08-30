import {
  CheckCircle2,
  Circle,
  Clock3,
  Flag,
} from "lucide-react";

interface AnalyticsBreakdownProps {
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
}

export function AnalyticsBreakdown({
  todoTasks,
  inProgressTasks,
  completedTasks,
  highPriorityTasks,
  mediumPriorityTasks,
  lowPriorityTasks,
}: AnalyticsBreakdownProps) {
  const totalTasks =
    todoTasks + inProgressTasks + completedTasks;

  const statusItems = [
    {
      label: "To Do",
      value: todoTasks,
      icon: Circle,
      iconClassName: "bg-slate-100 text-slate-600",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock3,
      iconClassName: "bg-blue-100 text-blue-600",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-600",
    },
  ];

  const priorityItems = [
    {
      label: "High",
      value: highPriorityTasks,
      iconClassName: "bg-red-100 text-red-600",
    },
    {
      label: "Medium",
      value: mediumPriorityTasks,
      iconClassName: "bg-amber-100 text-amber-600",
    },
    {
      label: "Low",
      value: lowPriorityTasks,
      iconClassName: "bg-emerald-100 text-emerald-600",
    },
  ];

  function getPercentage(value: number) {
    if (totalTasks === 0) {
      return 0;
    }

    return Math.round((value / totalTasks) * 100);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Task Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Task Status
            </h2>

            <p className="text-sm text-slate-500">
              Current state of your tasks
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {statusItems.map((item) => {
            const Icon = item.icon;
            const percentage = getPercentage(item.value);

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${item.iconClassName}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {item.value}
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Priority */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3">
            <Flag className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Task Priority
            </h2>

            <p className="text-sm text-slate-500">
              Distribution of task priorities
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {priorityItems.map((item) => {
            const percentage = getPercentage(item.value);

            return (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${item.iconClassName}`}
                    >
                      <Flag className="h-4 w-4" />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {item.value}
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-500 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}