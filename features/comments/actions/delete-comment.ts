"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  hasProjectAccess,
  isProjectManager,
} from "@/features/projects/utils/project-access";

export async function deleteComment(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      authorId: true,
      task: { select: { projectId: true } },
    },
  });

  if (
    !comment ||
    !(await hasProjectAccess(session.user.id, comment.task.projectId))
  ) {
    return { error: "Comment not found." };
  }

  const isAuthor = comment.authorId === session.user.id;

  if (
    !isAuthor &&
    !(await isProjectManager(session.user.id, comment.task.projectId))
  ) {
    return { error: "You don't have permission to delete this comment." };
  }

  await prisma.comment.delete({
    where: { id: comment.id },
  });

  revalidatePath(`/projects/${comment.task.projectId}`);
  revalidatePath("/tasks");

  return { success: true };
}