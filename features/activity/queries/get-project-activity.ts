import { prisma } from "@/lib/prisma";

import type { ActivityItemData } from "../types";

export const ACTIVITY_PAGE_SIZE = 15;

export async function getProjectActivity(projectId: string, cursor?: string) {
  const rows: ActivityItemData[] = await prisma.activityLog.findMany({
    where: { projectId },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    // Ask for one extra row. If it exists, there's another page.
    take: ACTIVITY_PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      type: true,
      createdAt: true,
      taskName: true,
      targetName: true,
      fromValue: true,
      toValue: true,
      actor: { select: { id: true, name: true } },
    },
  });

  const hasMore = rows.length > ACTIVITY_PAGE_SIZE;
  const items = hasMore ? rows.slice(0, ACTIVITY_PAGE_SIZE) : rows;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}