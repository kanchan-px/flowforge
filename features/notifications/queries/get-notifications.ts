import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getNotifications() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      notifications: [],
      unreadCount: 0,
    };
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
}