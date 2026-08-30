import { FolderKanban } from "lucide-react";

interface ProjectAnalytics {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
}

interface AnalyticsProjectsProps {
  projects: ProjectAnalytics[];
}

export function AnalyticsProjects({
  projects,
}: AnalyticsProjectsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-3">
          <FolderKanban className="h-5 w-5 text-blue-600" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Project Performance
          </h2>

          <p className="text-sm text-slate-500">
            Task completion across your projects
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">
            No projects available yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {projects.map((project) => {
            const completionRate =
              project.totalTasks === 0
                ? 0
                : Math.round(
                    (project.completedTasks /
                      project.totalTasks) *
                      100,
                  );

            return (
              <div key={project.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {project.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {project.completedTasks} of{" "}
                      {project.totalTasks} tasks completed
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-700">
                    {completionRate}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}