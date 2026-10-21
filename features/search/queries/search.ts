import { prisma } from "@/lib/prisma";
import { projectAccessFilter } from "@/features/projects/utils/project-access";

export async function searchProjectsAndTasks(
  userId: string,
  query: string,
) {
  const search = query.trim();

  if (!search) {
    return {
      projects: [],
      tasks: [],
    };
  }

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: {
        ...projectAccessFilter(userId),
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        project: projectAccessFilter(userId),
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        projectId: true,
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return {
    projects,
    tasks,
  };
}