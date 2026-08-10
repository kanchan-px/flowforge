"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { createNotification } from "@/features/notifications/actions/create-notification";

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

  if (task.project.ownerId !== session.user.id) {
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

  revalidatePath("/tasks");
}