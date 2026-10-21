"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/features/notifications/actions/create-notification";

export async function removeMember(memberId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const target = await prisma.projectMember.findUnique({
    where: { id: memberId },
    include: { project: { select: { id: true, name: true } } },
  });

  if (!target) {
    return { error: "Member not found." };
  }

  // The person making the request must be a member of the same project.
  const actor = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: session.user.id,
        projectId: target.projectId,
      },
    },
  });

  if (!actor) {
    return { error: "Member not found." };
  }

  if (target.role === "OWNER") {
    return { error: "The project owner can't be removed." };
  }

  const isSelf = target.userId === session.user.id;

  if (!isSelf) {
    if (actor.role === "MEMBER") {
      return { error: "You don't have permission to remove members." };
    }

    if (actor.role === "ADMIN" && target.role !== "MEMBER") {
      return { error: "Only the project owner can remove admins." };
    }
  }

  // Both steps succeed together or not at all.
  await prisma.$transaction([
    prisma.task.updateMany({
      where: {
        projectId: target.projectId,
        assigneeId: target.userId,
      },
      data: { assigneeId: null },
    }),
    prisma.projectMember.delete({
      where: { id: target.id },
    }),
  ]);

  if (!isSelf) {
    try {
      await createNotification({
        userId: target.userId,
        type: "MEMBER_REMOVED",
        title: "Removed from project",
        message: `${session.user.name} removed you from "${target.project.name}".`,
        projectId: target.projectId,
      });
    } catch (error) {
      console.error("Failed to create removal notification:", error);
    }
  }

  revalidatePath("/projects");
  revalidatePath("/tasks");

  // When you leave, you no longer have access to the project page, so
  // re-rendering it would flash a 404 before the redirect.
  if (!isSelf) {
    revalidatePath(`/projects/${target.projectId}`);
  }

  return { success: true, left: isSelf };
}