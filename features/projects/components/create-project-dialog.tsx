"use client";

import { useState } from "react";
import { CreateProjectForm } from "./create-project-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createProjectSchema,
  type CreateProjectValues,
} from "../schemas/create-project-schema";

import { Input } from "@/components/ui/input";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: CreateProjectValues) {
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {" "}
      <DialogTrigger className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
        + New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Project
          </DialogTitle>

          <DialogDescription>Create a new workspace project.</DialogDescription>
        </DialogHeader>

        <CreateProjectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
