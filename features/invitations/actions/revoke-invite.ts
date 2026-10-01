"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function revokeInvite(invitationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    return { error: "Invitation not found." };
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: session.user.id,
        projectId: invitation.projectId,
      },
    },
  });

  if (!membership || membership.role === "MEMBER") {
    return { error: "You don't have permission to revoke invitations." };
  }

  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: "REVOKED" },
  });

  revalidatePath(`/projects/${invitation.projectId}`);

  return { success: true };
}