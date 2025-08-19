import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type CategoryOption = { id: number; name: string };

export function useCategoryOptions() {
  return useQuery<CategoryOption[]>({
    queryKey: ["categoryOptions"],
    queryFn: async () => {
      const res = await api.get("/categories/options", {
        withCredentials: true,
      });
      const payload = res.data;
      if (Array.isArray(payload)) return payload as CategoryOption[];
      return (payload?.data ?? []) as CategoryOption[];
    },
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });
}
