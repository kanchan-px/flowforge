"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createTaskSchema,
  type CreateTaskValues,
} from "../schemas/create-task-schema";

import { createTask } from "../actions/create-task";

import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  members: { id: string; name: string }[];
}

interface CreateTaskFormProps {
  projects: Project[];
  projectId?: string;
  onSuccess: () => void;
}

export function CreateTaskForm({
  projects,
  projectId,
  onSuccess,
}: CreateTaskFormProps) {
  const [isPending, startTransition] = useTransition();

const {
  register,
  handleSubmit,
  setValue,
  watch,
  getValues,
  formState: { errors },
} = useForm<CreateTaskValues>({
  resolver: zodResolver(createTaskSchema),
  defaultValues: {
  name: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  projectId: projectId ?? projects[0]?.id ?? "",
  assigneeId: null,
},
});

useEffect(() => {
  if (projects.length > 0 && !getValues("projectId")) {
    setValue("projectId", projects[0].id);
  }
}, [projects, getValues, setValue]);

  function onSubmit(values: CreateTaskValues) {
    startTransition(async () => {
      try {
        await createTask(values);
        onSuccess();
      } catch (error) {
        console.error("Failed to create task:", error);
        toast.error("Couldn't create the task. Please try again.");
      }
    });
  }

    const selectedProjectId = watch("projectId");
  const selectedAssigneeId = watch("assigneeId");

  // The assignee list always comes from the currently selected project.
  const projectMembers =
    projects.find((project) => project.id === selectedProjectId)?.members ?? [];

  // If the user switches project, drop the assignee unless they also
  // belong to the new project.
  function clearAssigneeIfNotMember(nextProjectId: string) {
    const currentAssigneeId = getValues("assigneeId");

    if (!currentAssigneeId) {
      return;
    }

    const nextMembers =
      projects.find((project) => project.id === nextProjectId)?.members ?? [];

    if (!nextMembers.some((member) => member.id === currentAssigneeId)) {
      setValue("assigneeId", null);
    }
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

{!projectId && (
  <div>
    <label className="mb-2 block text-sm font-semibold">
      Project
    </label>

    <Select
      value={watch("projectId")}
      onValueChange={(value) => {
        if (value) {
          setValue("projectId", value);
          clearAssigneeIfNotMember(value);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue>
          {projects.find(
            (project) => project.id === watch("projectId")
          )?.name ?? "Select a project"}
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
)}

      <div>
        <label className="mb-2 block text-sm font-semibold">Status</label>

        <Select
          value={watch("status")}
          onValueChange={(value) => {
            if (value) {
              setValue("status", value as CreateTaskValues["status"]);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
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
              setValue("priority", value as CreateTaskValues["priority"]);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>

            <SelectItem value="MEDIUM">Medium</SelectItem>

            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

            <div>
        <label className="mb-2 block text-sm font-semibold">Assignee</label>

        <Select
          value={selectedAssigneeId ?? "unassigned"}
          onValueChange={(value) => {
            if (value) {
              setValue("assigneeId", value === "unassigned" ? null : value);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue>
              {projectMembers.find((member) => member.id === selectedAssigneeId)
                ?.name ?? "Unassigned"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>

            {projectMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
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
        {isPending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
