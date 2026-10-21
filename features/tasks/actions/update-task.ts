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

import {
  hasProjectAccess,
  isProjectMember,
} from "@/features/projects/utils/project-access";

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

  // Must have access to the task's current project...
  const hasAccess = await hasProjectAccess(session.user.id, task.projectId);

  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  // ...and to the destination project if the task is being moved.
  if (validated.projectId !== task.projectId) {
    const canMoveHere = await hasProjectAccess(
      session.user.id,
      validated.projectId,
    );

    if (!canMoveHere) {
      throw new Error("Unauthorized");
    }
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

  const assigneeChanged = (task.assigneeId ?? null) !== assigneeId;

  // Store whether the task's status actually changed.
  const statusChanged = task.status !== validated.status;

  // Update the task.
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
      assigneeId,
    },
  });

  // Record the status transition for analytics.
  if (statusChanged) {
    await prisma.taskStatusHistory.create({
      data: {
        taskId: task.id,
        fromStatus: task.status,
        toStatus: validated.status,
      },
    });
  }

  // Create a notification when a task is completed.
  if (task.status !== "DONE" && validated.status === "DONE") {
    await createNotification({
      userId: session.user.id,
      type: "TASK_COMPLETED",
      title: "Task completed",
      message: `You completed the task "${validated.name}".`,
    });
  }

  if (assigneeChanged && assigneeId && assigneeId !== session.user.id) {
    try {
      await createNotification({
        userId: assigneeId,
        type: "TASK_UPDATED",
        title: "Task assigned to you",
        message: `${session.user.name} assigned you the task "${validated.name}".`,
        taskId: task.id,
        projectId: validated.projectId,
      });
    } catch (error) {
      console.error("Failed to create assignment notification:", error);
    }
  }

  revalidatePath("/tasks");

  revalidatePath("/tasks");
}
