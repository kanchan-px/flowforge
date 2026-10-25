import Link from "next/link";

import { cn } from "@/lib/utils";

import { PROJECT_TABS, type ProjectTab } from "../../utils/project-tabs";

interface ProjectTabsNavProps {
  projectId: string;
  activeTab: ProjectTab;
  counts?: Partial<Record<ProjectTab, number>>;
}

export function ProjectTabsNav({
  projectId,
  activeTab,
  counts = {},
}: ProjectTabsNavProps) {
  return (
    <nav aria-label="Project sections" className="overflow-x-auto">
      <ul className="flex min-w-max gap-1 border-b border-slate-200">
        {PROJECT_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const count = counts[tab.id];

          return (
            <li key={tab.id}>
              <Link
                href={`/projects/${projectId}?tab=${tab.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800",
                )}
              >
                {tab.label}
                {count !== undefined && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}