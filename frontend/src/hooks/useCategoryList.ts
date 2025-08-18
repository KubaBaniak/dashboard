import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type CategoryRow = {
  id: number;
  name: string;
  description?: string | null;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Paged<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

type Args = { page: number; pageSize: number; q: string; enabled?: boolean };

export function useCategoryList({ page, pageSize, q, enabled = true }: Args) {
  const qTrim = q.trim();

  return useQuery({
    queryKey: ["categoryList", page, pageSize, qTrim],
    queryFn: async () => {
      const res = await api.get("/categories", {
        params: { page, pageSize, q: qTrim || undefined },
        withCredentials: true,
      });
      return res.data;
    },
    select: (payload: any): Paged<CategoryRow> => {
      const rows: any[] = Array.isArray(payload)
        ? payload
        : (payload?.data ?? []);
      const data: CategoryRow[] = rows.map((r: any) => ({
        id: Number(r.id),
        name: String(r.name),
        description: r.description ?? null,
        productCount: Number(r.productCount ?? r.count ?? 0),
        createdAt: String(r.createdAt ?? ""),
        updatedAt: String(r.updatedAt ?? ""),
      }));
      const pageOut = Number(payload?.page ?? page);
      const pageSizeOut = Number(payload?.pageSize ?? pageSize);
      const total = Number(payload?.total ?? data.length);
      return { data, page: pageOut, pageSize: pageSizeOut, total };
    },
    placeholderData: { data: [], page, pageSize, total: 0 },
    staleTime: 30_000,
    enabled,
  });
}
