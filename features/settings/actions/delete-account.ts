"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { getHasPassword } from "../queries/get-has-password";
import { isRecentSignIn } from "../utils/recent-sign-in";

type DeleteAccountResult =
  | { success: true }
  | { success: false; error: string; requiresReauth?: boolean };

export async function deleteAccount(
  currentPassword?: string,
): Promise<DeleteAccountResult> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized." };
  }

  const userId = session.user.id;

  // Decided here from the database, never from what the form claims.
  const hasPassword = await getHasPassword(userId);

  if (hasPassword) {
    if (typeof currentPassword !== "string" || currentPassword === "") {
      return { success: false, error: "Current password is required." };
    }

    try {
      await auth.api.verifyPassword({
        body: { password: currentPassword },
        headers: requestHeaders,
      });
    } catch {
      return { success: false, error: "Incorrect current password." };
    }
  } else if (!isRecentSignIn(session.session.createdAt)) {
    // Google-only account: they must have signed in with Google very recently.
    return {
      success: false,
      error: "For your security, confirm with Google again to delete your account.",
      requiresReauth: true,
    };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Failed to delete account:", error);

    return {
      success: false,
      error: "Something went wrong while deleting your account. Please try again.",
    };
  }

  return { success: true };
}