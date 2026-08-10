"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markNotificationAsRead(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const notification = await prisma.notification.findUnique({
    where: {
      id,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  // Important security check:
  // A user can only modify their own notification.
  if (notification.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.update({
    where: {
      id,
    },
    data: {
      read: true,
    },
  });

  revalidatePath("/", "layout");

  return {
    success: true,
  };
}