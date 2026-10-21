"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectAccessFilter } from "@/features/projects/utils/project-access";

export async function getProjects() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const projects = await prisma.project.findMany({
    where: projectAccessFilter(session.user.id),
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      members: {
        select: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    members: project.members.map((member) => member.user),
  }));
}