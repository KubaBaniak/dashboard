import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderStatus } from "@/components/orders/types";

type Vars = { orderId: number; status: OrderStatus };

export function useUpdateStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: Vars) => {
      const { data } = await api.patch(
        `/orders/${orderId}/status`,
        { status },
        { withCredentials: true },
      );
      return data;
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["clientOrders"] });
    },
  });
}
