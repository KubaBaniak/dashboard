import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const res = await api.post("/categories", input, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categoryOptions"] });
      qc.invalidateQueries({ queryKey: ["categoryList"] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...rest
    }: {
      id: number;
      name: string;
      description?: string;
    }) => {
      const res = await api.patch(`/categories/${id}`, rest, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categoryOptions"] });
      qc.invalidateQueries({ queryKey: ["categoryList"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`, { withCredentials: true });
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categoryOptions"] });
      qc.invalidateQueries({ queryKey: ["categoryList"] });
    },
  });
}
