import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCreateDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      productId: number;
      quantity: number;
      note?: string;
    }) => {
      const res = await api.post("/deliveries", input, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryList"] });
    },
  });
}

export function useUpdateDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...rest
    }: {
      id: number;
      productId: number;
      quantity: number;
      note?: string;
    }) => {
      const res = await api.patch(`/deliveries/${id}`, rest, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryList"] });
    },
  });
}

export function useDeleteDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/deliveries/${id}`, { withCredentials: true });
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["deliveryList"] });
    },
  });
}
