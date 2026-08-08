import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="text-slate-500">
            Manage all your projects
          </p>
        </div>

        <CreateProjectDialog />
      </div>

      <ProjectList />
    </div>
  );
}