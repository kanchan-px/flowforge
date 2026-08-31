"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function updateProfileImage(imageUrl: string) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to update your profile picture.",
    };
  }

  if (!imageUrl || !imageUrl.startsWith("https://")) {
    return {
      success: false,
      error: "Invalid image URL.",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imageUrl,
      },
    });

    revalidatePath("/settings");  
revalidatePath("/", "layout");

    return {
      success: true,
      message: "Profile picture updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update profile image:", error);

    return {
      success: false,
      error: "Failed to update your profile picture.",
    };
  }
}

