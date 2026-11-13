import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

// How long someone has to finish the Google check and press delete.
const REAUTH_WINDOW_MS = 10 * 60 * 1000;

function identifierFor(userId: string) {
  return `delete-account:${userId}`;
}

/** Writes "this user started a delete confirmation just now". */
export async function startDeleteReauthMarker(userId: string) {
  const identifier = identifierFor(userId);
  const now = new Date();

  await prisma.verification.deleteMany({ where: { identifier } });

  await prisma.verification.create({
    data: {
      id: randomUUID(),
      identifier,
      value: "delete-account",
      createdAt: now,
      expiresAt: new Date(now.getTime() + REAUTH_WINDOW_MS),
    },
  });
}

/**
 * True only if a marker exists and the CURRENT session was created after it.
 * That means a fresh Google sign-in happened after "Confirm with Google"
 * was clicked. An older session, even a recent one, can never pass.
 */
export async function hasCompletedDeleteReauth(
  userId: string,
  sessionCreatedAt: Date | string,
) {
  const marker = await prisma.verification.findFirst({
    where: {
      identifier: identifierFor(userId),
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (!marker) {
    return false;
  }

  return new Date(sessionCreatedAt).getTime() > marker.createdAt.getTime();
}

/** Removes the marker. A failure here must never block anything. */
export async function clearDeleteReauth(userId: string) {
  try {
    await prisma.verification.deleteMany({
      where: { identifier: identifierFor(userId) },
    });
  } catch (error) {
    console.error("Failed to clear delete confirmation:", error);
  }
}