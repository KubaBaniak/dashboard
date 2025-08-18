export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

export interface OrderRowDto {
  id: number;
  createdAt: string;
  buyerName: string | null;
  buyerEmail: string;
  status: OrderStatus;
  itemCount: number;
  totalAmount: string;
}

export interface OrdersResponse {
  data: OrderRowDto[];
  page: number;
  pageSize: number;
  total: number;
}
