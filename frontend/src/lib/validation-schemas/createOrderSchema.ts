import z from "zod";

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

export type OrderItemForOrderInput = z.infer<typeof orderItemForOrderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
