import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getProjectDetails } from "@/features/projects/queries/get-project-details";

import { TaskCard } from "@/features/tasks/components/task-card";
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";

import { getProjectMembers } from "@/features/members/queries/get-project-members";
import { getPendingInvitations } from "@/features/invitations/queries/get-pending-invitations";
import { InviteMemberDialog } from "@/features/invitations/components/invite-member-dialog";
import { PendingInvitationsList } from "@/features/invitations/components/pending-invitations-list";
import { MembersList } from "@/features/members/components/members-list";

interface ProjectDetailsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { projectId } = await params;

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

  const [members, pendingInvitations] = await Promise.all([
    getProjectMembers(projectId),
    getPendingInvitations(projectId),
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

        <MembersList members={members} />

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>

          <p className="mt-1 text-sm text-slate-500">
            All tasks belonging to this project.
          </p>
        </div>

        <CreateTaskDialog projectId={project.id} />
      </div>

      {/* Tasks */}
      {project.tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">No tasks yet</h3>

          <p className="mt-2 text-sm text-slate-500">
            Create your first task for this project.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {project.tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.name}
              description={task.description}
              status={task.status}
              priority={task.priority}
              dueDate={task.dueDate}
              projectId={task.projectId}
              projects={[
                {
                  id: project.id,
                  name: project.name,
                },
              ]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
