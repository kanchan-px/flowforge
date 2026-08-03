import { FolderKanban } from "lucide-react";


import { DeleteProjectButton } from "./delete-project-button";

import { EditProjectDialog } from "./edit-project-dialog";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
}

export function ProjectCard({ id, name, description }: ProjectCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <FolderKanban className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>

            <p className="mt-2 text-sm text-slate-500">
              {description || "No description"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <EditProjectDialog id={id} name={name} description={description} />

          <DeleteProjectButton id={id} />
        </div>
      </div>
    </div>
  );
}
