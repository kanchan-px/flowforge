import { z } from "zod";

export const createTaskSchema = z.object({
  name: z
    .string()
    .min(3, "Task name must be at least 3 characters.")
    .max(100, "Task name is too long."),

  description: z
    .string()
    .max(500, "Description is too long.")
    .optional(),

  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "DONE",
  ]),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]),

  dueDate: z.string().optional(),

  projectId: z.string(),
});

export type CreateTaskValues = z.infer<typeof createTaskSchema>;