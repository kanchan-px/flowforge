"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  createProjectSchema,
  type CreateProjectValues,
} from "../schemas/create-project-schema";

import { createProject } from "../actions/create-project";

interface Props {
  onSuccess: () => void;
}

export function CreateProjectForm({
  onSuccess,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: CreateProjectValues) {
    startTransition(async () => {
      const result = await createProject(values);

      if (result.error) {
        alert(result.error);
        return;
      }

      reset();
      onSuccess();
      router.refresh();
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
          placeholder="Enter project name"
          {...register("name")}
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

        <Input
          placeholder="Optional description"
          {...register("description")}
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
        {isPending
          ? "Creating..."
          : "Create Project"}
      </Button>
    </form>
  );
}