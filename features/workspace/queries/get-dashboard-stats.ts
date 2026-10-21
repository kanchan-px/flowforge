import { prisma } from "@/lib/prisma";
import { projectAccessFilter } from "@/features/projects/utils/project-access";

export async function getDashboardStats(userId: string) {
  const now = new Date();

    const taskWhere = {
    project: projectAccessFilter(userId),
  };

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
  ] = await Promise.all([
    prisma.project.count({
      where: projectAccessFilter(userId),
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