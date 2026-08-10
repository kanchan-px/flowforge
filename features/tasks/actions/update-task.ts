"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createNotification } from "@/features/notifications/actions/create-notification";

import {
  createTaskSchema,
  type CreateTaskValues,
} from "../schemas/create-task-schema";

export async function updateTask(id: string, values: CreateTaskValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = createTaskSchema.parse(values);

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.task.update({
    where: {
      id,
    },
    data: {
      name: validated.name,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      projectId: validated.projectId,
    },
  });

  if (task.status !== "DONE" && validated.status === "DONE") {
  await createNotification({
    userId: session.user.id,
    type: "TASK_COMPLETED",
    title: "Task completed",
    message: `You completed the task "${validated.name}".`,
  });
}

  revalidatePath("/tasks");
}
