"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EditProjectForm } from "./edit-project-form";

interface EditProjectDialogProps {
  id: string;
  name: string;
  description: string | null;
}

export function EditProjectDialog({
  id,
  name,
  description,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-slate-100"
      >
        <Pencil className="h-4 w-4" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Project
          </DialogTitle>

          <DialogDescription>
            Update your project details.
          </DialogDescription>
        </DialogHeader>

        <EditProjectForm
          id={id}
          name={name}
          description={description}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}