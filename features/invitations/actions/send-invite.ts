"use server";

import { headers } from "next/headers";
import crypto from "crypto";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInvitationEmail } from "@/lib/resend";

import {
  sendInviteSchema,
  type SendInviteValues,
} from "../schemas/send-invite-schema";

const INVITE_EXPIRY_DAYS = 7;

export async function sendInvite(values: SendInviteValues) {
  const parsed = sendInviteSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Invalid invite data." };
  }

  const { projectId, email, role } = parsed.data;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: session.user.id,
        projectId,
      },
    },
    include: { project: true },
  });

  if (!membership) {
    return { error: "You are not a member of this project." };
  }

  if (membership.role === "MEMBER") {
    return { error: "You don't have permission to invite members." };
  }

  if (membership.role === "ADMIN" && role === "ADMIN") {
    return { error: "Only the project owner can invite admins." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const alreadyMember = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: existingUser.id,
          projectId,
        },
      },
    });

    if (alreadyMember) {
      return { error: "This person is already a member of the project." };
    }
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  const existingInvitation = await prisma.invitation.findFirst({
    where: { projectId, email, status: "PENDING" },
  });

  if (existingInvitation) {
    await prisma.invitation.update({
      where: { id: existingInvitation.id },
      data: { token, expiresAt, role },
    });
  } else {
    await prisma.invitation.create({
      data: {
        projectId,
        email,
        role,
        token,
        expiresAt,
        invitedById: session.user.id,
      },
    });
  }

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`;

  await sendInvitationEmail({
    to: email,
    projectName: membership.project.name,
    inviteLink,
  });

  return { success: true };
}