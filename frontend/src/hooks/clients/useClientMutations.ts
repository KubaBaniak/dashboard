import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...rest
    }: {
      id: number;
      email?: string;
      name?: string;
      phone?: string;
      address?: string;
      company?: string;
    }) => {
      const res = await api.patch(`/clients/${id}`, rest, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientsBase"] });
    },
  });
}
