"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteAccount(currentPassword: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized.",
    };
  }

  if (!currentPassword) {
    return {
      success: false,
      error: "Current password is required.",
    };
  }

  try {
    await auth.api.verifyPassword({
      body: {
        password: currentPassword,
      },
      headers: await headers(),
    });

    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete account:", error);

    return {
      success: false,
      error: "Incorrect current password.",
    };
  }
}