import { TaskCard } from "./task-card";
import { Pagination } from "./pagination";
import { TaskStatus, TaskPriority } from "@prisma/client";

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  
}

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  hasFilters: boolean;
  totalTasks: number;
  page: number;
  totalPages: number;
}

export function TaskList({
  tasks,
  projects,
  hasFilters,
  totalTasks,
  page,
  totalPages,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20 text-center">
        <h3 className="text-xl font-bold">
          {hasFilters ? "No matching tasks" : "No tasks yet"}
        </h3>

        <p className="mt-2 text-slate-500">
          {hasFilters
            ? "Try changing or clearing your filters."
            : "Create your first task to get started."}
        </p>
      </div>
    );
  }

  return (
  <>
    <div className="mb-4 text-sm text-slate-500">
      {hasFilters ? (
        <>
          Showing <span className="font-semibold">{tasks.length}</span> of{" "}
          <span className="font-semibold">{totalTasks}</span> tasks
        </>
      ) : (
        <>
          <span className="font-semibold">{totalTasks}</span> Tasks
        </>
      )}
    </div>

    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          name={task.name}
          description={task.description}
          status={task.status}
          priority={task.priority}
          dueDate={task.dueDate}
          projectId={task.projectId}
          projects={projects}
        />
      ))}
    </div>

    <Pagination
      page={page}
      totalPages={totalPages}
    />
  </>
);
}
