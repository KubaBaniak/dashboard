import { z } from "zod";

const PL_PHONE_REGEX = /^(?:\+?48|0048)?[1-9]\d{8}$/;

export const clientBaseSchema = z.object({
  email: z.email("Enter a valid email address"),

  name: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),

  phone: z
    .string()
    .trim()
    .regex(PL_PHONE_REGEX, "Enter a valid Polish phone number")
    .optional()
    .or(z.literal("")),

  address: z.string().trim().min(1, "Address is required"),
});

export const createClientSchema = clientBaseSchema;

export const updateClientSchema = clientBaseSchema.extend({
  id: z.number().int().positive(),
  address: z.string().trim().optional().or(z.literal("")),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
