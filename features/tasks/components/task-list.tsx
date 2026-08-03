import { TaskCard } from "./task-card";

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: string;
}

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
}

export function TaskList({
  tasks,
  projects,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-20 text-center">
        <h3 className="text-xl font-bold">No tasks yet</h3>

        <p className="mt-2 text-slate-500">
          Create your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          name={task.name}
          description={task.description}
          status={task.status as "TODO" | "IN_PROGRESS" | "DONE"}
          priority={task.priority as "LOW" | "MEDIUM" | "HIGH"}
          dueDate={task.dueDate}
          projectId={task.projectId}
          projects={projects}
        />
      ))}
    </div>
  );
}