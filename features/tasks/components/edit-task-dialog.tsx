"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditTaskForm } from "./edit-task-form";

interface Project {
  id: string;
  name: string;
}

interface EditTaskDialogProps {
  id: string;
  name: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  projectId: string;
  projects: Project[];
}

export function EditTaskDialog(props: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white hover:bg-slate-100"
      >
        <Pencil className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>

          <DialogDescription>
            Update your task information.
          </DialogDescription>
        </DialogHeader>

        <EditTaskForm
          {...props}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}