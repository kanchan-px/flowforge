"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  updateProjectSchema,
  type UpdateProjectValues,
} from "../schemas/update-project-schema";

export async function updateProject(
  id: string,
  values: UpdateProjectValues
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  const validated =
    updateProjectSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Invalid form data.",
    };
  }

  const project =
    await prisma.project.findUnique({
      where: {
        id,
      },
    });

  if (!project) {
    return {
      error: "Project not found.",
    };
  }

  if (project.ownerId !== session.user.id) {
    return {
      error: "Unauthorized.",
    };
  }

  await prisma.project.update({
    where: {
      id,
    },
    data: validated.data,
  });

  revalidatePath("/workspace");

  return {
    success: true,
  };
}