import { z } from "zod";

export const deliveryBaseSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  note: z
    .string()
    .max(300, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export const createDeliverySchema = deliveryBaseSchema;

export const updateDeliverySchema = deliveryBaseSchema.extend({
  id: z.number().int().positive(),
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;
export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>;
