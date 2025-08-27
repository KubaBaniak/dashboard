import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type OrderItemRow = {
  id: number;
  productId: number;
  productTitle: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export function useOrderItems(orderId: number) {
  return useQuery<OrderItemRow[]>({
    queryKey: ["orderItems", orderId],
    enabled: Number.isFinite(orderId) && orderId > 0,
    queryFn: async () => {
      const { data } = await api.get<
        Array<{
          id: number;
          productId: number;
          quantity: number;
          price: string;
          product: { id: number; title: string | null; sku: string | null };
        }>
      >(`/orders/${orderId}/items`, { withCredentials: true });

      return data.map((it) => {
        const unitPrice = Number(it.price);
        return {
          id: it.id,
          productId: it.productId,
          productTitle: (it.product?.title ?? `#${it.productId}`).trim(),
          productSku: it.product?.sku ?? "",
          quantity: it.quantity,
          unitPrice,
          lineTotal: unitPrice * it.quantity,
        };
      });
    },
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
