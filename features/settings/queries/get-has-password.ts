import { prisma } from "@/lib/prisma";

/**
 * True if the user can sign in with an email and password.
 * Google-only users have no "credential" account row.
 */
export async function getHasPassword(userId: string) {
  const credential = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "credential",
      password: { not: null },
    },
    select: { id: true },
  });

  return credential !== null;
}