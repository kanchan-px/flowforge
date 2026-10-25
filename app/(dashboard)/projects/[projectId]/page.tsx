import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getProjectDetails } from "@/features/projects/queries/get-project-details";

import { TaskCard } from "@/features/tasks/components/task-card";
import { KanbanBoard } from "@/features/tasks/components/kanban-board";
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";

import { getProjectMembers } from "@/features/members/queries/get-project-members";
import { getPendingInvitations } from "@/features/invitations/queries/get-pending-invitations";
import { InviteMemberDialog } from "@/features/invitations/components/invite-member-dialog";
import { PendingInvitationsList } from "@/features/invitations/components/pending-invitations-list";
import { MembersList } from "@/features/members/components/members-list";

import { getProjectActivity } from "@/features/activity/queries/get-project-activity";
import { ActivityFeed } from "@/features/activity/components/activity-feed";

interface ProjectDetailsPageProps {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    view?: string;
  }>;
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: ProjectDetailsPageProps) {
  const { projectId } = await params;
  const { view } = await searchParams;
  const isBoardView = view === "board";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const project = await getProjectDetails(projectId, session.user.id);

  if (!project) {
    notFound();
  }

  const [members, pendingInvitations, activity] = await Promise.all([
     getProjectMembers(projectId),
     getPendingInvitations(projectId),
    getProjectActivity(projectId),
   ]);

  const currentMembership = members.find(
    (member) => member.user.id === session.user.id,
  );
  const canManageMembers =
    currentMembership?.role === "OWNER" || currentMembership?.role === "ADMIN";

  const completedTasks = project.tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const overdueTasks = project.tasks.filter(
    (task) =>
      task.dueDate && task.dueDate < new Date() && task.status !== "DONE",
  ).length;

    const projectsForForms = [
    {
      id: project.id,
      name: project.name,
      members: members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
      })),
    },
  ];

  // Worked out on the server so the cards don't read the clock themselves.
  const currentTime = new Date();

  const tasksForViews = project.tasks.map(({ _count, ...task }) => ({
     ...task,
     isPastDue: task.dueDate !== null && task.dueDate < currentTime,
    commentCount: _count.comments,
   }));


  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>

        <p className="mt-2 text-slate-500">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Tasks</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {project._count.tasks}
          </p>
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

      {/* Members */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Members</h2>
            <p className="mt-1 text-sm text-slate-500">
              People with access to this project.
            </p>
          </div>
          {canManageMembers && <InviteMemberDialog projectId={project.id} />}
        </div>

        <MembersList
          members={members}
          currentUserId={session.user.id}
          currentUserRole={currentMembership?.role}
        />
        
        {canManageMembers && pendingInvitations.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Pending Invitations
            </h3>
            <PendingInvitationsList invitations={pendingInvitations} />
          </div>
        )}
      </div>

      {/* Tasks Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>

          <p className="mt-1 text-sm text-slate-500">
            All tasks belonging to this project.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-sm font-medium">
            <Link
              href={`/projects/${project.id}`}
              className={cn(
                "rounded-lg px-3 py-1.5 transition",
                !isBoardView
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              List
            </Link>
            <Link
              href={`/projects/${project.id}?view=board`}
              className={cn(
                "rounded-lg px-3 py-1.5 transition",
                isBoardView
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              Board
            </Link>
          </div>

          <CreateTaskDialog projectId={project.id} />
        </div>
      </div>

      {/* Tasks */}
      {isBoardView ? (
        <KanbanBoard tasks={tasksForViews} projects={projectsForForms} />
      ) : project.tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No tasks yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Create your first task for this project.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasksForViews.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.name}
              description={task.description}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
              projectId={task.projectId}
              projects={projectsForForms}
              assignee={task.assignee}
              isPastDue={task.isPastDue}
              commentCount={task.commentCount}
            />
          ))}
        </div>
      )}

            {/* Activity */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Who changed what, and when.
          </p>
        </div>

        <ActivityFeed
          key={activity.items[0]?.id ?? "empty"}
          projectId={project.id}
          initialItems={activity.items}
          initialCursor={activity.nextCursor}
        />
      </div>
    </div>
  );
}
