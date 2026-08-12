import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAnalytics() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userId = session.user.id;

  const projectWhere = {
    ownerId: userId,
  };

  const taskWhere = {
    project: {
      ownerId: userId,
    },
  };

  const now = new Date();

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    highPriorityTasks,
    mediumPriorityTasks,
    lowPriorityTasks,
  ] = await Promise.all([
    prisma.project.count({
      where: projectWhere,
    }),

    prisma.task.count({
      where: taskWhere,
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: "DONE",
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: "IN_PROGRESS",
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        status: "TODO",
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        dueDate: {
          lt: now,
        },
        status: {
          not: "DONE",
        },
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        priority: "HIGH",
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        priority: "MEDIUM",
      },
    }),

    prisma.task.count({
      where: {
        ...taskWhere,
        priority: "LOW",
      },
    }),
  ]);

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    overview: {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      completionRate,
    },

    priority: {
      high: highPriorityTasks,
      medium: mediumPriorityTasks,
      low: lowPriorityTasks,
    },
  };
}