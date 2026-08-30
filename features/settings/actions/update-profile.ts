"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { updateProfileSchema } from "../schemas/update-profile-schema";

export async function updateProfile(formData: FormData) {
  // 1. Get the currently authenticated user
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to update your profile.",
    };
  }

  // 2. Get the name submitted by the form
  const name = formData.get("name");

  // 3. Validate the submitted data
  const result = updateProfileSchema.safeParse({
    name,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid name.",
    };
  }

  // 4. Update the authenticated user's profile
  try {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: result.data.name,
      },
    });

    // 5. Refresh the settings page
    revalidatePath("/settings");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update profile:", error);

    return {
      success: false,
      error: "Something went wrong while updating your profile.",
    };
  }
}

