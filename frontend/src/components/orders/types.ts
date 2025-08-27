export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

export interface OrderRowDto {
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
}

export interface OrdersResponse {
  data: OrderRowDto[];
  page: number;
  pageSize: number;
  total: number;
}
