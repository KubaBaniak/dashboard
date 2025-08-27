import { OrderStatus } from "@prisma/client";

export type OrderRowDto = {
  id: number;
  createdAt: string;
  buyerId: number;
  buyerName: string | null;
  buyerEmail: string;
  status: OrderStatus;
  shippingAddress: string;
  billingAddress: string;
  itemCount: number;
  totalAmount: string;
};
