import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100, "New password must be less than 100 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;