import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type CategoryOption = { id: number; name: string };

export function useCategories() {
  return useQuery<CategoryOption[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories", { withCredentials: true });
      const payload = res.data;
      if (Array.isArray(payload)) return payload as CategoryOption[];
      return (payload?.data ?? []) as CategoryOption[];
    },
    staleTime: 60_000,
  });
}
