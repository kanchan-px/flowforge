
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function removeProfileImage() {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to update your profile.",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: null,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Profile picture removed.",
    };
  } catch (error) {
    console.error("Failed to remove profile image:", error);

    return {
      success: false,
      error: "Failed to remove your profile picture.",
    };
  }
}
