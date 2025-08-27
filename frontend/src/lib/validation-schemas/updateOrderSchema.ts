import { z } from "zod";

export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "SHIPPED",
  "CANCELLED",
]);

export const baseUpdateOrderSchema = z.object({
  id: z.number().int().positive(),
  shippingAddress: z.string().min(1).optional(),
  billingAddress: z.string().min(1).optional(),
  status: orderStatusSchema.optional(),
});

export type BaseUpdateOrderInput = z.infer<typeof baseUpdateOrderSchema>;
