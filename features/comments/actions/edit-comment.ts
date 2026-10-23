"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProjectAccess } from "@/features/projects/utils/project-access";

import { commentContentSchema } from "../schemas/comment-schema";

export async function editComment(commentId: string, content: string) {
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

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      authorId: true,
      task: { select: { projectId: true } },
    },
  });

  // Also re-checks project access, so someone removed from the project
  // can't keep editing their old comments.
  if (
    !comment ||
    !(await hasProjectAccess(session.user.id, comment.task.projectId))
  ) {
    return { error: "Comment not found." };
  }

  if (comment.authorId !== session.user.id) {
    return { error: "You can only edit your own comments." };
  }

  await prisma.comment.update({
    where: { id: comment.id },
    data: { content: parsed.data, editedAt: new Date() },
  });

  return { success: true };
}