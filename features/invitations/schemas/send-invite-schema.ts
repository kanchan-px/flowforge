import { z } from "zod";

export const sendInviteSchema = z.object({
  projectId: z.string().min(1),
  email: z.string().email("Enter a valid email address."),
  role: z.enum(["MEMBER", "ADMIN"]),
});

export type SendInviteValues = z.infer<typeof sendInviteSchema>;