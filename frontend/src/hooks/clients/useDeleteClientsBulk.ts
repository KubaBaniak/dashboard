import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

type Resp = { deleted: number; failed: { id: number; reason: string }[] };

export function useDeleteClientsBulk() {
  return useMutation<Resp, unknown, number[]>({
    mutationFn: async (ids: number[]) => {
      const { data } = await api.post<Resp>("/clients/bulk-delete", { ids });
      return data;
    },
  });
}
