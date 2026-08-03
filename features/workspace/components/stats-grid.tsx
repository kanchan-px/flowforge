import {
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
} from "lucide-react";

import { StatsCard } from "./stats-card";

export function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Projects"
        value={12}
        description="Active projects"
        icon={FolderKanban}
      />

      <StatsCard
        title="Tasks"
        value={48}
        description="Open tasks"
        icon={CheckSquare}
      />

      <StatsCard
        title="Team"
        value={8}
        description="Members"
        icon={Users}
      />

      <StatsCard
        title="Completed"
        value={132}
        description="Finished tasks"
        icon={BarChart3}
      />
    </div>
  );
}