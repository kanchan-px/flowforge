"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/features/notifications/actions/create-notification";

export async function acceptInvite(token: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "You must be signed in to accept this invitation." };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { project: { select: { name: true } } },
  });

  if (!invitation) {
    return { error: "This invitation link is invalid." };
  }

  if (invitation.status === "REVOKED") {
    return { error: "This invitation has been revoked." };
  }

  if (invitation.status === "ACCEPTED") {
    return { error: "This invitation has already been accepted." };
  }

  if (invitation.status === "DECLINED") {
    return { error: "This invitation was declined." };
  }

  if (invitation.expiresAt < new Date()) {
    if (invitation.status !== "EXPIRED") {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
    }
    return { error: "This invitation has expired." };
  }

  if (invitation.email !== session.user.email) {
    return {
      error: `This invitation was sent to ${invitation.email}. Sign in with that email to accept it.`,
    };
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: session.user.id,
        projectId: invitation.projectId,
      },
    },
  });

  if (existingMembership) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });
    return { success: true, projectId: invitation.projectId };
  }

  await prisma.$transaction([
    prisma.projectMember.create({
      data: {
        userId: session.user.id,
        projectId: invitation.projectId,
        role: invitation.role,
      },
    }),
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    }),
  ]);

  await createNotification({
    userId: invitation.invitedById,
    type: "INVITATION_ACCEPTED",
    title: "Invitation accepted",
    message: `${session.user.name} accepted your invitation to join "${invitation.project.name}".`,
    projectId: invitation.projectId,
  });

  revalidatePath(`/projects/${invitation.projectId}`);
  revalidatePath("/projects");
  revalidatePath("/invitations");

  return { success: true, projectId: invitation.projectId };
}