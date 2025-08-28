import api from "@/lib/api";
import { UpdateProductInput } from "@/lib/validation-schemas/updateProductSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductInput;
    }) => {
      const res = await api.patch(`/products/${id}`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await api.delete(`/products/${productId}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"], refetchType: "all" });
      qc.invalidateQueries({ queryKey: ["productOptions"] });
    },
  });
}
