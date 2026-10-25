import type { ActivityType } from "@prisma/client";

export interface ActivityItemData {
  id: string;
  type: ActivityType;
  createdAt: Date;
  taskName: string | null;
  targetName: string | null;
  fromValue: string | null;
  toValue: string | null;
  actor: { id: string; name: string } | null;
}