import {
  FolderKanban,
  CheckSquare,
  CircleCheckBig,
  TriangleAlert,
} from "lucide-react";

import { getSession } from "@/lib/session";
import { getDashboardStats } from "../queries/get-dashboard-stats";
import { StatsCard } from "./stats-card";

export async function StatsGrid() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Projects"
        value={stats.totalProjects}
        description="Active projects"
        icon={FolderKanban}
      />

      <StatsCard
        title="Tasks"
        value={stats.totalTasks}
        description="Total tasks"
        icon={CheckSquare}
      />

      <StatsCard
        title="Completed"
        value={stats.completedTasks}
        description="Finished tasks"
        icon={CircleCheckBig}
      />

      <StatsCard
        title="Overdue"
        value={stats.overdueTasks}
        description="Past due date"
        icon={TriangleAlert}
      />
    </div>
  );
}