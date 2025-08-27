import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderStatus } from "@/components/orders/types";

type Vars = { orderId: number; status: OrderStatus };

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      orderId: number;
      data: Partial<{
        status: OrderStatus;
        shippingAddress: string;
        billingAddress: string;
      }>;
    }) => {
      const { orderId, data } = params;
      const res = await api.patch(`/orders/${orderId}`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", vars.orderId] });
      qc.invalidateQueries({ queryKey: ["orderItems", vars.orderId] });
      qc.invalidateQueries({ queryKey: ["clientOrders"] });
    },
  });
}

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

export function useAddOrderItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      orderId: number;
      productId: number;
      quantity: number;
    }) => {
      const { orderId, productId, quantity } = params;
      const res = await api.post(
        `/order-items`,
        { orderId, productId, quantity },
        { withCredentials: true },
      );
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["orderItems", vars.orderId] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["order", vars.orderId] });
    },
  });
}

export function useRemoveOrderItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { orderItemId: number; orderId: number }) => {
      const { orderItemId } = params;
      const res = await api.delete(`/order-items/${orderItemId}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["orderItems", vars.orderId] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["order", vars.orderId] });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await api.delete(`/orders/${orderId}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["clientOrders"] });
    },
  });
}
