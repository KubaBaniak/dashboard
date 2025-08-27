import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type OrderRow = {
  id: number;
  createdAt: string;
  buyerEmail?: string | null;
  buyerName?: string | null;
  status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
  itemCount: number;
  totalAmount: string | number;
};

export type OrdersResponse = {
  data: OrderRow[];
  total: number;
  page: number;
  pageSize: number;
};

type Args = {
  clientId: number;
  page: number;
  pageSize: number;
  q?: string;
  status?: "ALL" | "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
};

export function useClientOrders({
  clientId,
  page,
  pageSize,
  q = "",
  status = "ALL",
}: Args) {
  return useQuery<OrdersResponse>({
    queryKey: ["clientOrders", clientId, page, pageSize, q, status],
    queryFn: async () => {
      const { data } = await api.get<OrdersResponse>("/orders", {
        params: {
          page,
          pageSize,
          ...(q ? { q } : {}),
          ...(status && status !== "ALL" ? { status } : {}),
          buyerId: clientId,
        },
        withCredentials: true,
      });
      return data;
    },
    staleTime: 30_000,
    placeholderData: { data: [], total: 0, page, pageSize },
    enabled: !!clientId,
  });
}
