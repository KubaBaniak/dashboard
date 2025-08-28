export class DashboardStatsDto {
  totalRevenue: number;
  totalRevenueChangePct: number;

  newCustomers: number;
  newCustomersChangePct: number;

  activeAccounts: number;
  activeAccountsChangePct: number;

  revenueGrowthRatePct: number;
}

export type DashboardStatsQuery = {
  period?: "7d" | "30d" | "90d";
};
