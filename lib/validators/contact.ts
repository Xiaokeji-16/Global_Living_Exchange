import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  messageType: z.string().optional(),
  message: z.string().min(1),
});

export type ContactPayload = z.infer<typeof contactSchema>;