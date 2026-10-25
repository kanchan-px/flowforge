import { Suspense } from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getProjectDetails } from "@/features/projects/queries/get-project-details";
import { resolveProjectTab } from "@/features/projects/utils/project-tabs";

import { ActivityTab } from "@/features/projects/components/tabs/activity-tab";
import { MembersTab } from "@/features/projects/components/tabs/members-tab";
import { OverviewTab } from "@/features/projects/components/tabs/overview-tab";
import { ProjectTabsNav } from "@/features/projects/components/tabs/project-tabs-nav";
import { ProjectTasksTab } from "@/features/projects/components/tabs/project-tasks-tab";

interface ProjectDetailsPageProps {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
    view?: string;
  }>;
}

function TabSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: ProjectDetailsPageProps) {
  const { projectId } = await params;
  const { tab, view } = await searchParams;
  const activeTab = resolveProjectTab(tab, view);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  // Also the access check: returns null unless you own or belong to this project.
  const project = await getProjectDetails(projectId, session.user.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>

        <p className="mt-2 text-slate-500">
          {project.description || "No description provided."}
        </p>
      </div>

      <ProjectTabsNav
        projectId={project.id}
        activeTab={activeTab}
        counts={{
          list: project._count.tasks,
          members: project._count.members,
        }}
      />

      <Suspense key={activeTab} fallback={<TabSkeleton />}>
        {activeTab === "overview" && <OverviewTab project={project} />}

        {(activeTab === "board" || activeTab === "list") && (
          <ProjectTasksTab project={project} view={activeTab} />
        )}

        {activeTab === "members" && (
          <MembersTab projectId={project.id} currentUserId={session.user.id} />
        )}

        {activeTab === "activity" && <ActivityTab projectId={project.id} />}
      </Suspense>
    </div>
  );
}