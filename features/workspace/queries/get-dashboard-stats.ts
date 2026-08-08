import { prisma } from "@/lib/prisma";

export async function getDashboardStats(userId: string) {
  const now = new Date();

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        ownerId: userId,
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        status: "DONE",
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: userId,
        },
        dueDate: {
          lt: now,
        },
        status: {
          not: "DONE",
        },
      },
    }),
  ]);

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
  };
}