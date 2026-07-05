import { z } from "zod";

export const leadSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name is too short")
    .max(100),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .optional(),

  company: z
    .string()
    .optional(),

  service_interest: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, "Message is too short")
    .max(2000),

  website: z
    .string()
    .optional(),
});

export type LeadInput =
  z.infer<typeof leadSchema>;
  
