"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  hasProjectAccess,
  isProjectManager,
} from "@/features/projects/utils/project-access";

import type { CommentData } from "../types";

const MAX_COMMENTS = 100;

type TaskCommentsResult =
  | { error: string }
  | { comments: CommentData[]; currentUserId: string; canModerate: boolean };

export async function getTaskComments(
  taskId: string,
): Promise<TaskCommentsResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  });

  // Same message whether the task doesn't exist or isn't yours to see.
  if (!task || !(await hasProjectAccess(session.user.id, task.projectId))) {
    return { error: "Task not found." };
  }

  const [newestFirst, canModerate] = await Promise.all([
    prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      take: MAX_COMMENTS,
      select: {
        id: true,
        content: true,
        createdAt: true,
        editedAt: true,
        author: { select: { id: true, name: true } },
      },
    }),
    isProjectManager(session.user.id, task.projectId),
  ]);

  return {
    comments: newestFirst.reverse(),
    currentUserId: session.user.id,
    canModerate,
  };
}