import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type ProductOption = { id: number; title: string };

export function useProductOptions() {
  return useQuery<ProductOption[]>({
    queryKey: ["productsOptions"],
    queryFn: async () => {
      const res = await api.get("/products/options", {
        withCredentials: true,
      });
      const payload = res.data;
      if (Array.isArray(payload)) return payload as ProductOption[];
      return (payload?.data ?? []) as ProductOption[];
    },
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
