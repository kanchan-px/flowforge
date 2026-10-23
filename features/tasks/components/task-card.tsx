import { Calendar, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditTaskDialog } from "./edit-task-dialog";
import { TaskCommentsDialog } from "@/features/comments/components/task-comments-dialog";
import { DeleteTaskButton } from "./delete-task-button";
import { TaskStatus, TaskPriority } from "@prisma/client";

interface Project {
  id: string;
  name: string;
  members: { id: string; name: string }[];
}

interface TaskCardProps {
  id: string;
  name: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate: Date | null;

  projectId: string;
  projects: Project[];
  assignee?: { id: string; name: string } | null;
  isPastDue: boolean;
  commentCount: number;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "TODO":
      return {
        label: "Todo",
        className: "bg-slate-100 text-slate-700",
      };

    case "IN_PROGRESS":
      return {
        label: "In Progress",
        className: "bg-amber-100 text-amber-700",
      };

    case "DONE":
      return {
        label: "Done",
        className: "bg-emerald-100 text-emerald-700",
      };

    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export function getPriorityBadge(priority: string) {
  switch (priority) {
    case "LOW":
      return {
        label: "Low",
        className: "bg-emerald-100 text-emerald-700",
      };

    case "MEDIUM":
      return {
        label: "Medium",
        className: "bg-amber-100 text-amber-700",
      };

    case "HIGH":
      return {
        label: "High",
        className: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: priority,
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export function TaskCard({
  id,
  name,
  description,
  status,
  priority,
  dueDate,
  projectId,
  projects,
  assignee = null,
  isPastDue = false,
  commentCount = 0,
}: TaskCardProps) {
  const statusBadge = getStatusBadge(status);
  const priorityBadge = getPriorityBadge(priority);
  const isOverdue = isPastDue && status !== "DONE";

  const projectName =
    projects.find((project) => project.id === projectId)?.name ?? "Unknown Project";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm",
        isOverdue ? "border-red-200" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold">{name}</h3>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
          <TaskCommentsDialog
            taskId={id}
            taskName={name}
            commentCount={commentCount}
          />

          <EditTaskDialog
            id={id}
            name={name}
            description={description}
            status={status}
            priority={priority}
            dueDate={dueDate}
            projectId={projectId}
            assigneeId={assignee?.id ?? null}
            projects={projects}
          />

          <DeleteTaskButton id={id} />
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {description || "No description"}
      </p>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4" />
          {projectName}
        </div>

        <div
          className={cn(
            "flex items-center gap-2",
            isOverdue && "font-medium text-red-600",
          )}
        >
           <Calendar className="h-4 w-4" />
           {dueDate ? dueDate.toLocaleDateString() : "No due date"}
          {isOverdue && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              Overdue
            </span>
          )}
         </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${priorityBadge.className}`}
        >
          {priorityBadge.label}
        </span>

        {assignee ? (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
              {assignee.name.charAt(0).toUpperCase()}
            </span>
            {assignee.name}
          </div>
        ) : (
          <span className="text-sm text-slate-400">Unassigned</span>
        )}
      </div>
    </div>
  );
}