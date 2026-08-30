import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters."),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

