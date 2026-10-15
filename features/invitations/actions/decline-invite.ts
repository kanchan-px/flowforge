"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/features/notifications/actions/create-notification";

export async function declineInvite(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { project: { select: { name: true } } },
  });

  // Same message for "doesn't exist" and "not yours", so we don't
  // reveal whether someone else's invitation ID is real.
  if (!invitation || invitation.email !== session.user.email) {
    return { error: "Invitation not found." };
  }

  if (invitation.status !== "PENDING") {
    return { error: "This invitation is no longer pending." };
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: "DECLINED" },
  });

  await createNotification({
    userId: invitation.invitedById,
    type: "INVITATION_DECLINED",
    title: "Invitation declined",
    message: `${session.user.name} declined your invitation to join "${invitation.project.name}".`,
    projectId: invitation.projectId,
  });

  revalidatePath("/invitations");
  revalidatePath(`/projects/${invitation.projectId}`);

  return { success: true };
}