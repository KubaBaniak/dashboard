import { Prisma } from "@prisma/client";

export type OrderItemForProductCreation = { productId: number; quantity: number };

export type CreateOrderWithLines = {
  buyerId: number;
  shippingAddress: string;
  billingAddress: string;
  items: { productId: number; quantity: number }[];
};

export type CreatedOrderWithItems = Prisma.OrderGetPayload<{
  include: {
    buyer: true;
    items: {
      include: {
        product: { select: { id: true; title: true; sku: true } };
      };
    };
  };
}>;

export type OrderItemRow = Prisma.OrderItemGetPayload<{
  select: { quantity: true; price: true };
}>;

export type OrderWithItemsRow = Prisma.OrderGetPayload<{
  select: {
    id: true;
    createdAt: true;
    items: { select: { quantity: true; price: true } };
  };
}>;

export type TopProductAggRow = {
  productId: number;
  _sum: { quantity: number | null };
};

export type ProductTitleRow = Prisma.ProductGetPayload<{
  select: { id: true; title: true };
}>;

export type BuyerStats = {
  totalOrders: number;
  lifetimeSpend: number;
  averageOrderValue: number;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  ordersPerMonth: number | null;
};

export type BuyerTopProduct = { productId: number; title: string | null; quantity: number };
export type BuyerRecentOrder = { id: number; createdAt: string; total: number };
