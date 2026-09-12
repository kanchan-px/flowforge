"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type NotificationPreference =
  | "taskCompletedNotifications"
  | "projectActivityNotifications"
  | "systemNotifications";

export async function updateNotificationPreference(
  preference: NotificationPreference,
  enabled: boolean,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [preference]: enabled,
      },
    });

    revalidatePath("/settings");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to update notification preference:",
      error,
    );

    return {
      success: false,
      error: "Failed to update notification preference.",
    };
  }
}