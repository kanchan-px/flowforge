"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function searchDashboard(query: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      projects: [],
      tasks: [],
    };
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      projects: [],
      tasks: [],
    };
  }

  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: session.user.id,
        name: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        project: {
          ownerId: session.user.id,
        },
        OR: [
          {
            name: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: trimmedQuery,
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