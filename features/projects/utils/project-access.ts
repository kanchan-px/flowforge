import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

/**
 * Prisma "where" fragment for projects the user can access:
 * projects they own OR are a member of.
 */
export function projectAccessFilter(userId: string): Prisma.ProjectWhereInput {
  return {
    OR: [{ ownerId: userId }, { members: { some: { userId } } }],
  };
}

/**
 * True if the user owns the project or is a member of it.
 */
export async function hasProjectAccess(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ...projectAccessFilter(userId),
    },
    select: { id: true },
  });

  return project !== null;
}