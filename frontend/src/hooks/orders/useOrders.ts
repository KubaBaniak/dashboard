import { OrdersResponse } from "@/components/orders/types";
import api from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type UseOrdersArgs = {
  page: number;
  pageSize: number;
  q: string;
  status: string;
};

export function useOrders({ page, pageSize, q, status }: UseOrdersArgs) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", page, pageSize, q, status],
    queryFn: async () => {
      const { data } = await api.get<OrdersResponse>("/orders", {
        params: {
          page,
          pageSize,
          ...(q ? { q } : {}),
          ...(status && status !== "ALL" ? { status } : {}),
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}
