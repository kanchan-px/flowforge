"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createNotification } from "@/features/notifications/actions/create-notification";

import {
  createTaskSchema,
  type CreateTaskValues,
} from "../schemas/create-task-schema";

export async function createTask(values: CreateTaskValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = createTaskSchema.parse(values);

const task = await prisma.task.create({
  data: {
    name: validated.name,
    description: validated.description,
    status: validated.status,
    priority: validated.priority,
    dueDate: validated.dueDate
      ? new Date(validated.dueDate)
      : null,
    projectId: validated.projectId,
  },
});

await prisma.taskStatusHistory.create({
  data: {
    taskId: task.id,
    fromStatus: null,
    toStatus: task.status,
  },
});

await createNotification({
  userId: session.user.id,
  type: "TASK_CREATED",
  title: "Task created",
  message: `You created the task "${task.name}".`,
});

  revalidatePath("/tasks");
  revalidatePath("/workspace");
}