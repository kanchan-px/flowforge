import { prisma } from "@/lib/prisma";

export async function getPendingInvitations(projectId: string) {
  return prisma.invitation.findMany({
    where: { projectId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}