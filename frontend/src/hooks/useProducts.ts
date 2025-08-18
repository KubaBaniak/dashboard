import { ProductsResponse } from "@/components/products/types";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type UseProductsArgs = {
  page: number;
  pageSize: number;
  q?: string;
  categoryId?: number;
};

// useProducts.ts
export function useProducts({
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
      console.log(data);
      return data;
    },
    staleTime: 30_000,
    placeholderData: { data: [], page, pageSize, total: 0 }, // 👈 always defined
  });
}
