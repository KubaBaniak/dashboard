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
      const { data } = await api.get<unknown>(`/clients/${clientId}/overview`, {
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

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object";
}

function toNumber(v: unknown): number {
  return typeof v === "number" ? v : Number(v);
}

function toString(v: unknown): string {
  return typeof v === "string" ? v : String(v);
}

function normalizeOverview(payload: unknown): ClientOverview {
  const root = isRecord(payload) ? payload : {};

  const statsIn = isRecord(root.stats) ? root.stats : {};

  const stats: ClientStats = {
    totalOrders: toNumber(statsIn.totalOrders ?? 0),
    lifetimeSpend: toNumber(statsIn.lifetimeSpend ?? 0),
    averageOrderValue: toNumber(statsIn.averageOrderValue ?? 0),
    firstOrderAt:
      typeof statsIn.firstOrderAt === "string" ? statsIn.firstOrderAt : null,
    lastOrderAt:
      typeof statsIn.lastOrderAt === "string" ? statsIn.lastOrderAt : null,
    ordersPerMonth:
      statsIn.ordersPerMonth == null ? null : toNumber(statsIn.ordersPerMonth),
  };

  const topProductsSrc = Array.isArray(root.topProducts)
    ? root.topProducts
    : [];

  const topProducts: ClientTopProduct[] = topProductsSrc.map(
    (item): ClientTopProduct => {
      const rec = isRecord(item) ? item : {};
      return {
        productId: toNumber(rec.productId),
        title: typeof rec.title === "string" ? rec.title : null,
        quantity: toNumber(rec.quantity),
      };
    },
  );

  const ordersSrc = Array.isArray(root.orders) ? root.orders : [];

  const orders: ClientOrderSummary[] = ordersSrc.map(
    (item): ClientOrderSummary => {
      const rec = isRecord(item) ? item : {};
      return {
        id: toNumber(rec.id),
        createdAt: toString(rec.createdAt),
        total: toNumber(rec.total),
      };
    },
  );

  return { stats, topProducts, orders };
}
