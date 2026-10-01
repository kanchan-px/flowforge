import { prisma } from "@/lib/prisma";

export async function getInvitationByToken(token: string) {
  return prisma.invitation.findUnique({
    where: { token },
    include: {
      project: {
        select: { id: true, name: true, color: true, icon: true },
      },
      invitedBy: {
        select: { name: true, email: true },
      },
    },
  });
}