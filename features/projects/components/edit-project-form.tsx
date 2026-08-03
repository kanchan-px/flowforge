"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  updateProjectSchema,
  type UpdateProjectValues,
} from "../schemas/update-project-schema";

import { updateProject } from "../actions/update-project";

interface EditProjectFormProps {
  id: string;
  name: string;
  description: string | null;
  onSuccess: () => void;
}

export function EditProjectForm({
  id,
  name,
  description,
  onSuccess,
}: EditProjectFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProjectValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name,
      description: description ?? "",
    },
  });

  function onSubmit(values: UpdateProjectValues) {
    startTransition(async () => {
      const result = await updateProject(id, values);

      if (result.success) {
        onSuccess();
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Project Name
        </label>

        <Input
          {...register("name")}
          placeholder="Project name"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Description
        </label>

        <Textarea
          rows={4}
          {...register("description")}
          placeholder="Describe your project..."
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}