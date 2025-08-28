import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type DashboardStats = {
  totalRevenue: number;
  totalRevenueChangePct: number;
  newCustomers: number;
  newCustomersChangePct: number;
  activeAccounts: number;
  activeAccountsChangePct: number;
  revenueGrowthRatePct: number;
};

export function useDashboardStats(period: "7d" | "30d" | "90d" = "30d") {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats", period],
    queryFn: async ({ signal }) => {
      const { data } = await api.get<DashboardStats>("/metrics/dashboard", {
        params: { period },
        withCredentials: true,
        signal,
      });
      return data;
    },
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
