"use server";

import { NotificationType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
}: CreateNotificationInput) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      taskCompletedNotifications: true,
      projectActivityNotifications: true,
      systemNotifications: true,
    },
  });

  if (!user) {
    return;
  }

  /*
   * Task completed notifications
   */
  if (
    type === "TASK_COMPLETED" &&
    !user.taskCompletedNotifications
  ) {
    return;
  }

  /*
   * Project activity notifications
   */
  if (
    type.startsWith("PROJECT_") &&
    !user.projectActivityNotifications
  ) {
    return;
  }

  /*
   * There are currently no dedicated SYSTEM notification
   * types in the NotificationType enum.
   *
   * When system notification types are added later,
   * they can be checked against:
   *
   * user.systemNotifications
   */

  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });
}