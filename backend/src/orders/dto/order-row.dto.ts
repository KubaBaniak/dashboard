import { OrderStatus } from "@prisma/client";

export type OrderRowDto = {
  id: number;
  createdAt: string;
  buyerName: string | null;
  buyerEmail: string;
  status: OrderStatus;
  itemCount: number;
  totalAmount: string;
};
