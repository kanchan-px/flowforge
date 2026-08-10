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
  await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });
}