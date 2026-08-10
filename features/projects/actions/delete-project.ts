"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { createNotification } from "@/features/notifications/actions/create-notification";

export async function deleteProject(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  if (!project) {
    return {
      error: "Project not found.",
    };
  }

  // Security check
  if (project.ownerId !== session.user.id) {
    return {
      error: "Unauthorized.",
    };
  }

  await createNotification({
  userId: session.user.id,
  type: "PROJECT_DELETED",
  title: "Project deleted",
  message: `You deleted the project "${project.name}".`,
});

  await prisma.project.delete({
    where: {
      id,
    },
  });

  revalidatePath("/workspace");

  return {
    success: true,
  };
}