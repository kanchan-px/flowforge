import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
} from "lucide-react";

interface Activity {
  id: string;
  taskId: string;
  taskName: string;
  projectId: string;
  projectName: string;
  fromStatus: "TODO" | "IN_PROGRESS" | "DONE" | null;
  toStatus: "TODO" | "IN_PROGRESS" | "DONE";
  changedAt: Date;
}

interface AnalyticsActivityProps {
  activities: Activity[];
}

function getStatusLabel(
  status: Activity["toStatus"] | Activity["fromStatus"],
) {
  switch (status) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "DONE":
      return "Done";

    default:
      return "New";
  }
}

function getStatusIcon(status: Activity["toStatus"]) {
  switch (status) {
    case "DONE":
      return CheckCircle2;

    case "IN_PROGRESS":
      return LoaderCircle;

    case "TODO":
      return Circle;

    default:
      return Clock3;
  }
}

function formatActivityTime(date: Date) {
  const activityDate = new Date(date);
  const now = new Date();

  const diff = now.getTime() - activityDate.getTime();

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return activityDate.toLocaleDateString();
}

export function AnalyticsActivity({
  activities,
}: AnalyticsActivityProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-semibold text-slate-900">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Recent task status changes
        </p>
      </div>

      {/* Activity list */}
      {activities.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>

          <p className="mt-3 text-sm font-medium text-slate-700">
            No activity yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Change a task status to see activity here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activities.map((activity) => {
            const StatusIcon = getStatusIcon(activity.toStatus);

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 px-6 py-5"
              >
                {/* Status icon */}
                <div className="mt-0.5 rounded-xl bg-slate-100 p-2.5">
                  <StatusIcon className="h-5 w-5 text-slate-600" />
                </div>

                {/* Activity information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {activity.taskName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {activity.projectName}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-slate-400">
                      {formatActivityTime(activity.changedAt)}
                    </span>
                  </div>

                  {/* Status transition */}
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                      {getStatusLabel(activity.fromStatus)}
                    </span>

                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />

                    <span className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600">
                      {getStatusLabel(activity.toStatus)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}