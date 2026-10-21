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

import {
  hasProjectAccess,
  isProjectMember,
} from "@/features/projects/utils/project-access";

export async function createTask(values: CreateTaskValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = createTaskSchema.parse(values);

  const hasAccess = await hasProjectAccess(
    session.user.id,
    validated.projectId,
  );

  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const assigneeId = validated.assigneeId ?? null;

  if (assigneeId) {
    const assigneeIsMember = await isProjectMember(
      assigneeId,
      validated.projectId,
    );

    if (!assigneeIsMember) {
      throw new Error("The assignee must be a member of this project.");
    }
  }

  const task = await prisma.task.create({
    data: {
      name: validated.name,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      projectId: validated.projectId,
      assigneeId,
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

  if (assigneeId && assigneeId !== session.user.id) {
  try {
    await createNotification({
      userId: assigneeId,
      type: "TASK_UPDATED",
      title: "Task assigned to you",
      message: `${session.user.name} assigned you the task "${task.name}".`,
      taskId: task.id,
      projectId: task.projectId,
    });
  } catch (error) {
    console.error("Failed to create assignment notification:", error);
  }
}

  revalidatePath("/tasks");
  revalidatePath("/workspace");
}
