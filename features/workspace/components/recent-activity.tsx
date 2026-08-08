import {
  CheckCircle2,
  FolderKanban,
  Clock,
} from "lucide-react";

import { getSession } from "@/lib/session";
import { getRecentActivity } from "../queries/get-recent-activity";

function formatStatus(status: string) {
  switch (status) {
    case "TODO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "DONE":
      return "Completed";
    default:
      return status;
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function RecentActivity() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const activity = await getRecentActivity(session.user.id);

  const items = [
    ...activity.projects.map((project) => ({
      id: project.id,
      title: "New Project",
      description: `${project.name} was created.`,
      date: project.createdAt,
      icon: FolderKanban,
    })),

    ...activity.tasks.map((task) => ({
      id: task.id,
      title: "Task Updated",
      description: `${task.name} moved to ${formatStatus(task.status)}.`,
      date: task.updatedAt,
      icon: CheckCircle2,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Recent Activity
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Latest updates from your workspace.
      </p>

      <div className="mt-6 space-y-6">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent activity yet.
          </p>
        ) : (
          items.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={`${activity.title}-${activity.id}`}
                className="flex items-start gap-4"
              >
                <div className="shrink-0 rounded-xl bg-blue-100 p-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {formatRelativeTime(activity.date)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}