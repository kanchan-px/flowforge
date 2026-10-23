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

/**
 * True only if the user has a ProjectMember row for this project.
 * Used to validate task assignees.
 */
export async function isProjectMember(userId: string, projectId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
    select: { id: true },
  });

  return membership !== null;
}

/**
 * True if the user is the project's owner or an admin, the people
 * who can moderate (for example, delete other people's comments).
 */
export async function isProjectManager(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      members: { where: { userId }, select: { role: true } },
    },
  });

  if (!project) {
    return false;
  }

  if (project.ownerId === userId) {
    return true;
  }

  const role = project.members[0]?.role;

  return role === "OWNER" || role === "ADMIN";
}