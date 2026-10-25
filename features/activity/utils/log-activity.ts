import type { ActivityType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface LogActivityInput {
  type: ActivityType;
  projectId: string;
  actorId: string;
  taskId?: string;
  taskName?: string | null;
  targetName?: string | null;
  fromValue?: string | null;
  toValue?: string | null;
}

/**
 * Adds one line to a project's activity diary.
 *
 * It never throws: the diary is a bonus, so if writing to it fails, the
 * real action (moving a task, sending an invite, ...) must still succeed.
 */
export async function logActivity(input: LogActivityInput) {
  try {
    await prisma.activityLog.create({
      data: {
        type: input.type,
        projectId: input.projectId,
        actorId: input.actorId,
        taskId: input.taskId ?? null,
        taskName: input.taskName ?? null,
        targetName: input.targetName ?? null,
        fromValue: input.fromValue ?? null,
        toValue: input.toValue ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}