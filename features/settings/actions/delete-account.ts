"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { getHasPassword } from "../queries/get-has-password";
import {
  clearDeleteReauth,
  hasCompletedDeleteReauth,
} from "../utils/delete-reauth";

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
  } else {
    // Google-only account: they must have started the confirmation and then
    // signed in with Google again AFTER that.
    const confirmed = await hasCompletedDeleteReauth(
      userId,
      session.session.createdAt,
    );

    if (!confirmed) {
      return {
        success: false,
        error: "Please confirm with Google to delete your account.",
        requiresReauth: true,
      };
    }
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

  await clearDeleteReauth(userId);

  return { success: true };
}