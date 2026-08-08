import Link from "next/link";

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Link href="/projects" className="block">
        <StatsCard
          title="Projects"
          value={stats.totalProjects}
          description="Active projects"
          icon={FolderKanban}
        />
      </Link>

      <Link href="/tasks" className="block">
        <StatsCard
          title="Tasks"
          value={stats.totalTasks}
          description="Total tasks"
          icon={CheckSquare}
        />
      </Link>

      <Link href="/tasks?status=DONE" className="block">
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          description="Finished tasks"
          icon={CircleCheckBig}
        />
      </Link>

      <Link href="/tasks?overdue=true" className="block">
        <StatsCard
          title="Overdue"
          value={stats.overdueTasks}
          description="Past due date"
          icon={TriangleAlert}
        />
      </Link>
    </div>
  );
}