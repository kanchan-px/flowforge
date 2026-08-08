"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createTaskSchema,
  type CreateTaskValues,
} from "../schemas/create-task-schema";

import { updateTask } from "../actions/update-task";

import { TaskStatus, TaskPriority } from "@prisma/client";

interface Project {
  id: string;
  name: string;
}

interface EditTaskFormProps {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  projects: Project[];
  onSuccess: () => void;
}

export function EditTaskForm({
  id,
  name,
  description,
  status,
  priority,
  dueDate,
  projectId,
  projects,
  onSuccess,
}: EditTaskFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
  name,
  description: description ?? "",
  status: status as CreateTaskValues["status"],
  priority: priority as CreateTaskValues["priority"],
  dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "",
  projectId,
},
  });

  function onSubmit(values: CreateTaskValues) {
    startTransition(async () => {
      await updateTask(id, values);
      reset();
      onSuccess();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold">Task Name</label>

        <Input {...register("name")} placeholder="Enter task name" />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Description</label>

        <Textarea
          rows={4}
          {...register("description")}
          placeholder="Describe the task..."
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Project</label>

        <Select
          value={watch("projectId")}
          onValueChange={(value) => {
            if (value) {
              setValue("projectId", value, {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {projects.find((project) => project.id === watch("projectId"))
                ?.name ?? "Select a project"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.projectId && (
          <p className="mt-1 text-sm text-red-500">
            {errors.projectId.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Status</label>

        <Select
          value={watch("status")}
          onValueChange={(value) => {
            if (value) {
              setValue("status", value as CreateTaskValues["status"], {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {watch("status") === "TODO"
                ? "Todo"
                : watch("status") === "IN_PROGRESS"
                  ? "In Progress"
                  : "Done"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="TODO">Todo</SelectItem>

            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>

            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Priority</label>

        <Select
          value={watch("priority")}
          onValueChange={(value) => {
            if (value) {
              setValue("priority", value as CreateTaskValues["priority"], {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {watch("priority") === "LOW"
                ? "Low"
                : watch("priority") === "MEDIUM"
                  ? "Medium"
                  : "High"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>

            <SelectItem value="MEDIUM">Medium</SelectItem>

            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Due Date</label>

        <Input type="date" {...register("dueDate")} />

        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-500">{errors.dueDate.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
