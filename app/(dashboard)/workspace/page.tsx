import { Greeting } from "@/features/workspace/components/greeting";
import { StatsGrid } from "@/features/workspace/components/stats-grid";
import { RecentActivity } from "@/features/workspace/components/recent-activity";

import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectList } from "@/features/projects/components/project-list";

export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      <Greeting />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Your Projects
        </h2>

        <CreateProjectDialog />
      </div>

      <ProjectList />

      <StatsGrid />

      <RecentActivity />
    </div>
  );
}