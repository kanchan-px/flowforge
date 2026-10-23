"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProjectAccess } from "@/features/projects/utils/project-access";
import { createNotification } from "@/features/notifications/actions/create-notification";

import { commentContentSchema } from "../schemas/comment-schema";

export async function addComment(taskId: string, content: string) {
  const parsed = commentContentSchema.safeParse(content);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid comment." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, name: true, projectId: true, assigneeId: true },
  });

  if (!task || !(await hasProjectAccess(session.user.id, task.projectId))) {
    return { error: "Task not found." };
  }

  await prisma.comment.create({
    data: {
      taskId: task.id,
      authorId: session.user.id,
      content: parsed.data,
    },
  });

  // The comment is saved. Notifications are a bonus, so a failure here
  // must not turn a successful post into an error.
  try {
    const earlier = await prisma.comment.findMany({
      where: { taskId: task.id, authorId: { not: null } },
      distinct: ["authorId"],
      select: { authorId: true },
    });

    const candidateIds = new Set<string>();

    if (task.assigneeId) {
      candidateIds.add(task.assigneeId);
    }

    for (const row of earlier) {
      if (row.authorId) {
        candidateIds.add(row.authorId);
      }
    }

    candidateIds.delete(session.user.id);

    if (candidateIds.size > 0) {
      // Only people who are still on the project.
      const stillMembers = await prisma.projectMember.findMany({
        where: {
          projectId: task.projectId,
          userId: { in: Array.from(candidateIds) },
        },
        select: { userId: true },
      });

      await Promise.allSettled(
        stillMembers.map((member) =>
          createNotification({
            userId: member.userId,
            type: "TASK_COMMENTED",
            title: "New comment",
            message: `${session.user.name} commented on "${task.name}".`,
            taskId: task.id,
            projectId: task.projectId,
          }),
        ),
      );
    }
  } catch (error) {
    console.error("Failed to create comment notifications:", error);
  }

  revalidatePath(`/projects/${task.projectId}`);
  revalidatePath("/tasks");

  return { success: true };
}