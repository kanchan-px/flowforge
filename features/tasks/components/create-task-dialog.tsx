"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getProjects } from "../actions/get-projects";
import { CreateTaskForm } from "./create-task-form";

interface Project {
  id: string;
  name: string;
}

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjects();
      setProjects(data);
    }

    if (open) {
      loadProjects();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
        + New Task
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Task
          </DialogTitle>

          <DialogDescription>
            Add a new task to one of your projects.
          </DialogDescription>
        </DialogHeader>

        <CreateTaskForm
          projects={projects}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}