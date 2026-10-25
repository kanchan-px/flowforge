"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { hasProjectAccess } from "@/features/projects/utils/project-access";

import { getProjectActivity } from "../queries/get-project-activity";
import type { ActivityItemData } from "../types";

type MoreActivityResult =
  | { error: string }
  | { items: ActivityItemData[]; nextCursor: string | null };

export async function getMoreActivity(
  projectId: string,
  cursor: string,
): Promise<MoreActivityResult> {
  if (typeof projectId !== "string" || typeof cursor !== "string") {
    return { error: "Invalid request." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized." };
  }

  if (!(await hasProjectAccess(session.user.id, projectId))) {
    return { error: "Project not found." };
  }

  return getProjectActivity(projectId, cursor);
}