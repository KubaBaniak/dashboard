import { z } from "zod";

export const orderItemForOrderSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  buyerId: z.number().int().positive(),
  shippingAddress: z.string().min(1),
  billingAddress: z.string().min(1),
  items: z.array(orderItemForOrderSchema).min(1),
});

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

export type OrderItemForOrderInput = z.infer<typeof orderItemForOrderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type BaseUpdateOrderInput = z.infer<typeof baseUpdateOrderSchema>;
