"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProjectAccess } from "@/features/projects/utils/project-access";
import { createNotification } from "@/features/notifications/actions/create-notification";

const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

export async function updateTaskStatus(taskId: string, status: string) {
  const parsed = updateTaskStatusSchema.safeParse({ taskId, status });

  if (!parsed.success) {
    return { error: "Invalid request." };
  }

  const nextStatus = parsed.data.status;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const task = await prisma.task.findUnique({
    where: { id: parsed.data.taskId },
    select: { id: true, name: true, status: true, projectId: true },
  });

  // Same message whether the task doesn't exist or isn't yours to touch,
  // so the response doesn't reveal which task IDs are real.
  if (!task || !(await hasProjectAccess(session.user.id, task.projectId))) {
    return { error: "Task not found." };
  }

  if (task.status === nextStatus) {
    return { success: true };
  }

  // Only move the task if it is STILL in the status we just read.
  // If someone else moved it in the meantime, count is 0 and we stop.
  const moved = await prisma.$transaction(async (tx) => {
    const result = await tx.task.updateMany({
      where: { id: task.id, status: task.status },
      data: { status: nextStatus },
    });

    if (result.count === 0) {
      return false;
    }

    await tx.taskStatusHistory.create({
      data: {
        taskId: task.id,
        fromStatus: task.status,
        toStatus: nextStatus,
      },
    });

    return true;
  });

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/tasks");
  revalidatePath("/workspace");
  revalidatePath("/analytics");

  if (!moved) {
    return {
      error: "Someone just updated this task. The board has been refreshed.",
    };
  }

  if (task.status !== "DONE" && nextStatus === "DONE") {
    try {
      await createNotification({
        userId: session.user.id,
        type: "TASK_COMPLETED",
        title: "Task completed",
        message: `You completed the task "${task.name}".`,
        taskId: task.id,
        projectId: task.projectId,
      });
    } catch (error) {
      console.error("Failed to create completion notification:", error);
    }
  }

  return { success: true };
}