import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type CreateProductInput = {
  title: string;
  description?: string;
  sku: string;
  stockQuantity: number;
  price: number;
  categoryIds: number[];
};

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const res = await api.post("/products", input, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
