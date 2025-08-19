/* eslint-disable  @typescript-eslint/no-explicit-any */
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type DeliveryRow = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  deliveredAt: string;
  note?: string;
};

export type Paged<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

type Args = { page: number; pageSize: number; q: string; enabled?: boolean };

export function useDeliveryList({ page, pageSize, q, enabled = true }: Args) {
  const qTrim = q.trim();

  return useQuery({
    queryKey: ["deliveryList", page, pageSize, qTrim],
    queryFn: async ({ signal }) => {
      const res = await api.get("/deliveries", {
        params: { page, pageSize, q: qTrim || undefined },
        withCredentials: true,
        signal,
      });
      return res.data;
    },
    select: (payload: any): Paged<DeliveryRow> => {
      const rows: any[] = Array.isArray(payload)
        ? payload
        : (payload?.data ?? []);
      const data: DeliveryRow[] = rows.map((r: DeliveryRow) => ({
        id: Number(r.id),
        productId: Number(r.productId),
        productName: String(r.productName),
        quantity: Number(r.quantity),
        deliveredAt: String(r.deliveredAt),
        note: String(r.note ?? ""),
      }));
      const pageOut = Number(payload?.page ?? page);
      const pageSizeOut = Number(payload?.pageSize ?? pageSize);
      const total = Number(payload?.total ?? data.length);
      return { data, page: pageOut, pageSize: pageSizeOut, total };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled,
  });
}
