import { Greeting } from "@/features/workspace/components/greeting";
import { StatsGrid } from "@/features/workspace/components/stats-grid";
import { RecentActivity } from "@/features/workspace/components/recent-activity";

import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectList } from "@/features/projects/components/project-list";

export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      <Greeting />

      <StatsGrid />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Projects
              </h2>

              <p className="text-sm text-slate-500">
                Manage your active projects.
              </p>
            </div>

            <CreateProjectDialog />
          </div>

          <ProjectList />
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}