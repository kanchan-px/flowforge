import { prisma } from "@/lib/prisma";

export async function getLinkedAccounts(userId: string) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { providerId: true, password: true },
  });

  return {
    hasPassword: accounts.some(
      (account) => account.providerId === "credential" && account.password,
    ),
    hasGoogle: accounts.some((account) => account.providerId === "google"),
  };
}