import { z } from "zod";

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters.")
    .max(100),

  description: z
    .string()
    .max(500)
    .optional(),
});

export type UpdateProjectValues =
  z.infer<typeof updateProjectSchema>;