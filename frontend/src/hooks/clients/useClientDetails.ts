import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type ClientTopProduct = {
  productId: number;
  title: string | null;
  quantity: number;
};

export type ClientOrderSummary = {
  id: number;
  createdAt: string;
  total: number;
};

export type ClientStats = {
  totalOrders: number;
  lifetimeSpend: number;
  averageOrderValue: number;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  ordersPerMonth: number | null;
};

export type ClientOverview = {
  stats: ClientStats;
  topProducts: ClientTopProduct[];
  orders: ClientOrderSummary[];
};

export function useClientDetails(
  clientId: number | null | undefined,
  opts?: { enabled?: boolean },
) {
  const enabled = Boolean(clientId) && (opts?.enabled ?? true);

  return useQuery<ClientOverview>({
    queryKey: ["clientOverview", clientId],
    enabled,
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/clients/${clientId}/overview`, {
        withCredentials: true,
        signal,
      });
      return normalizeOverview(data);
    },
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

function normalizeOverview(payload: any): ClientOverview {
  const statsIn = payload?.stats ?? {};
  const stats: ClientStats = {
    totalOrders: statsIn.totalOrders,
    lifetimeSpend: statsIn.lifetimeSpend,
    averageOrderValue: statsIn.averageOrderValue,
    firstOrderAt: statsIn.firstOrderAt ?? null,
    lastOrderAt: statsIn.lastOrderAt ?? null,
    ordersPerMonth:
      statsIn.ordersPerMonth == null ? null : statsIn.ordersPerMonth,
  };

  const topProducts: ClientTopProduct[] = Array.isArray(payload?.topProducts)
    ? payload.topProducts.map((p: any) => ({
        productId: Number(p.productId),
        title: p.title ?? null,
        quantity: p.quantity,
      }))
    : [];

  const orders: ClientOrderSummary[] = Array.isArray(payload?.orders)
    ? payload.orders.map((o: any) => ({
        id: Number(o.id),
        createdAt: String(o.createdAt),
        total: o.total,
      }))
    : [];

  return { stats, topProducts, orders };
}
