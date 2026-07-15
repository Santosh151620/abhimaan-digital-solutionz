import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .optional(),

  service: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),

  source: z
    .string()
    .default("website"),
});

export type ContactFormData = z.infer<
  typeof contactSchema
>;





