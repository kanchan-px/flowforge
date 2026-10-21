import { prisma } from "@/lib/prisma";
import { projectAccessFilter } from "@/features/projects/utils/project-access";

export async function getRecentActivity(userId: string) {
  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: projectAccessFilter(userId),
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        project: projectAccessFilter(userId),
      },
      select: {
        id: true,
        name: true,
        status: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    projects,
    tasks,
  };
}