/* eslint-disable  @typescript-eslint/no-explicit-any */
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type BaseClientRow = {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
};

export type Paged<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

type Args = { page: number; pageSize: number; q: string; enabled?: boolean };

export function useClientsBase({ page, pageSize, q, enabled = true }: Args) {
  const qTrim = q.trim();

  return useQuery({
    queryKey: ["clientsBase", page, pageSize, qTrim],
    queryFn: async ({ signal }) => {
      const res = await api.get("/clients", {
        params: { page, pageSize, q: qTrim || undefined },
        withCredentials: true,
        signal,
      });
      return res.data;
    },
    select: (payload: any): Paged<BaseClientRow> => {
      const data: any[] = Array.isArray(payload)
        ? payload
        : (payload?.data ?? []);
      const pageOut = Number(payload?.page ?? page);
      const pageSizeOut = Number(payload?.pageSize ?? pageSize);
      const total = Number(payload?.total ?? data.length);
      return { data, page: pageOut, pageSize: pageSizeOut, total };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}
