import Link from "next/link";

import { ActivityFeed } from "@/features/activity/components/activity-feed";
import { getProjectActivity } from "@/features/activity/queries/get-project-activity";
import type { ProjectDetails } from "@/features/projects/queries/get-project-details";

export async function OverviewTab({ project }: { project: ProjectDetails }) {
  const recent = await getProjectActivity(project.id);

  const currentTime = new Date();

  const totalTasks = project._count.tasks;

  const completedTasks = project.tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const overdueTasks = project.tasks.filter(
    (task) =>
      task.dueDate && task.dueDate < currentTime && task.status !== "DONE",
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalTasks}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {completedTasks}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{overdueTasks}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Progress</p>
          <p className="text-sm font-semibold text-slate-900">{progress}%</p>
        </div>

        <div
          role="progressbar"
          aria-label="Completed tasks"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Recent activity */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>

          <Link
            href={`/projects/${project.id}?tab=activity`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <ActivityFeed
          projectId={project.id}
          initialItems={recent.items.slice(0, 5)}
          initialCursor={null}
        />
      </div>
    </div>
  );
}