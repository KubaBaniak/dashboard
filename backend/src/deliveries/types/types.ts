import { Prisma } from "@prisma/client";

export type DeliveryWithProductNameAndId = Prisma.DeliveryGetPayload<{
  select: {
    id: true;
    productId: true;
    product: { select: { title: true } };
    quantity: true;
    deliveredAt: true;
    note: true;
  };
}>;

export type FindPagedDeliveries = { rows: DeliveryWithProductNameAndId[]; total: number };
