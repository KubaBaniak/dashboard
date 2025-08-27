import { Prisma } from "@prisma/client";

export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: { product: { select: { id: true; title: true; sku: true } } };
}>;
