import { getProjectMembers } from "@/features/members/queries/get-project-members";
import type { ProjectDetails } from "@/features/projects/queries/get-project-details";
import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { KanbanBoard } from "@/features/tasks/components/kanban-board";
import { TaskCard } from "@/features/tasks/components/task-card";

interface ProjectTasksTabProps {
  project: ProjectDetails;
  view: "board" | "list";
}

export async function ProjectTasksTab({
  project,
  view,
}: ProjectTasksTabProps) {
  const members = await getProjectMembers(project.id);

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>

          <p className="mt-1 text-sm text-slate-500">
            All tasks belonging to this project.
          </p>
        </div>

        <CreateTaskDialog projectId={project.id} />
      </div>

      {view === "board" ? (
        <KanbanBoard tasks={tasksForViews} projects={projectsForForms} />
      ) : tasksForViews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">No tasks yet</h3>

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
    </div>
  );
}