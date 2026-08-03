"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import {
  createProjectSchema,
  type CreateProjectValues,
} from "../schemas/create-project-schema";

export async function createProject(values: unknown) {
  // Validate form data
  const parsed = createProjectSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: "Invalid project data.",
    };
  }

  // Get current logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "Unauthorized.",
    };
  }

  // Create project
  await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/workspace");

  return {
    success: true,
  };
}