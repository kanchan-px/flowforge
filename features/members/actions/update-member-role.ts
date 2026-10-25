"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/features/notifications/actions/create-notification";
import { logActivity } from "@/features/activity/utils/log-activity";

const roleSchema = z.enum(["ADMIN", "MEMBER"]);

export async function updateMemberRole(memberId: string, role: string) {
  const parsedRole = roleSchema.safeParse(role);

  if (!parsedRole.success) {
    return { error: "Invalid role." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

    const target = await prisma.projectMember.findUnique({
    where: { id: memberId },
    include: {
      project: { select: { id: true, name: true } },
      user: { select: { name: true } },
    },
  });

  if (!target) {
    return { error: "Member not found." };
  }

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

  if (actor.role !== "OWNER") {
    return { error: "Only the project owner can change roles." };
  }

  if (target.role === "OWNER") {
    return { error: "The owner's role can't be changed." };
  }

  if (target.role === parsedRole.data) {
    return { success: true };
  }

  await prisma.projectMember.update({
    where: { id: target.id },
    data: { role: parsedRole.data },
  });

  await logActivity({
    type: "MEMBER_ROLE_CHANGED",
    projectId: target.projectId,
    actorId: session.user.id,
    targetName: target.user.name,
    fromValue: target.role,
    toValue: parsedRole.data,
  });

  try {
    await createNotification({
      userId: target.userId,
      type: "MEMBER_ROLE_CHANGED",
      title: "Your role changed",
      message: `${session.user.name} changed your role in "${target.project.name}" to ${
        parsedRole.data === "ADMIN" ? "Admin" : "Member"
      }.`,
      projectId: target.projectId,
    });
  } catch (error) {
    console.error("Failed to create role-change notification:", error);
  }

  revalidatePath(`/projects/${target.projectId}`);

  return { success: true };
}