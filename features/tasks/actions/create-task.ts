"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  createTaskSchema,
  type CreateTaskValues,
} from "../schemas/create-task-schema";

export async function createTask(values: CreateTaskValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = createTaskSchema.parse(values);

  await prisma.task.create({
    data: {
      name: validated.name,
      description: validated.description,
      status: validated.status,
      priority: validated.priority,
      dueDate: validated.dueDate
        ? new Date(validated.dueDate)
        : null,
      projectId: validated.projectId,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/workspace");
}