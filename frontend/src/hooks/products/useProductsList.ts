import { ProductsResponse } from "@/components/products/types";
import api from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type UseProductsArgs = {
  page: number;
  pageSize: number;
  q?: string;
  categoryId?: number;
};

export function useProductsList({
  page,
  pageSize,
  q = "",
  categoryId,
}: UseProductsArgs) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", page, pageSize, q, categoryId ?? null],
    queryFn: async () => {
      const { data } = await api.get<ProductsResponse>("/products", {
        params: {
          page,
          pageSize,
          ...(q ? { q } : {}),
          ...(categoryId ? { categoryId } : {}),
        },
      });
      return data;
    },
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
