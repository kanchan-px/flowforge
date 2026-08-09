import Link from "next/link";
import {
  FolderKanban,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

import { DeleteProjectButton } from "./delete-project-button";
import { EditProjectDialog } from "./edit-project-dialog";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  taskCount: number;
}

export function ProjectCard({
  id,
  name,
  description,
  createdAt,
  updatedAt,
  taskCount,
}: ProjectCardProps) {
  return (
    <div className="group flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      {/* Clickable Project Information */}
      <Link
        href={`/projects/${id}`}
        className="flex flex-1 items-start gap-5"
      >
        <div className="rounded-2xl bg-blue-100 p-4">
          <FolderKanban className="h-7 w-7 text-blue-600" />
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="text-xl font-bold text-slate-900">
            {name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {description || "No description provided."}
          </p>

          <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-600" />

              <span>
                <span className="font-semibold text-slate-800">
                  {taskCount}
                </span>{" "}
                Tasks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />

              <span>
                {createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Edit / Delete */}
      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <EditProjectDialog
          id={id}
          name={name}
          description={description}
        />

        <DeleteProjectButton id={id} />
      </div>
    </div>
  );
}