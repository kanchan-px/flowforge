"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { getHasPassword } from "../queries/get-has-password";
import { startDeleteReauthMarker } from "../utils/delete-reauth";

export async function startDeleteReauth(): Promise<
  { success: true } | { success: false; error: string }
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized." };
  }

  // Accounts with a password confirm with the password instead.
  if (await getHasPassword(session.user.id)) {
    return { success: false, error: "Your account uses a password." };
  }

  try {
    await startDeleteReauthMarker(session.user.id);
  } catch (error) {
    console.error("Failed to start delete confirmation:", error);
    return { success: false, error: "Couldn't start the confirmation. Please try again." };
  }

  return { success: true };
}