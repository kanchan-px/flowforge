"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createNotification } from "@/features/notifications/actions/create-notification";

import { hasProjectAccess } from "@/features/projects/utils/project-access";
import { logActivity } from "@/features/activity/utils/log-activity";

export async function deleteTask(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

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

  const hasAccess = await hasProjectAccess(session.user.id, task.projectId);

  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  await createNotification({
  userId: session.user.id,
  type: "TASK_DELETED",
  title: "Task deleted",
  message: `You deleted the task "${task.name}".`,
});

  await prisma.task.delete({
    where: {
      id,
    },
  });
  // No taskId here on purpose: the task no longer exists, and pointing
  // a diary line at a deleted task would be rejected by the database.
  // taskName keeps the line readable.
  await logActivity({
    type: "TASK_DELETED",
    projectId: task.projectId,
    actorId: session.user.id,
    taskName: task.name,
  });

  revalidatePath("/tasks");
  revalidatePath(`/projects/${task.projectId}`);

}