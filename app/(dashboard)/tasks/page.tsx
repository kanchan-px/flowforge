import { CreateTaskDialog } from "@/features/tasks/components/create-task-dialog";
import { TaskList } from "@/features/tasks/components/task-list";

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-slate-500">
            Manage all your project tasks
          </p>
        </div>

        <CreateTaskDialog />
      </div>

      <TaskList />
    </div>
  );
}