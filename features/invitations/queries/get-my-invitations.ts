import { prisma } from "@/lib/prisma";

export async function getMyInvitations(email: string) {
  return prisma.invitation.findMany({
    where: {
      email,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    include: {
      project: { select: { id: true, name: true, description: true } },
      invitedBy: { select: { name: true } },
    },
  });
}