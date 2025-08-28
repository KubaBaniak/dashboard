import { StatCard } from "./StatCard";
import { useDashboardStats } from "@/hooks/metrics/useDashboardStats";
import { formatCurrency } from "../utils/format-currency";
import { Skeleton } from "../ui/skeleton";

function pct(v: number) {
  const sign = v > 0 ? "+" : v < 0 ? "" : "";
  return `${sign}${v.toFixed(1)}%`;
}

export function SectionCards() {
  const { data, isLoading } = useDashboardStats("30d");

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  const revenue = formatCurrency(data.totalRevenue, "pl-PL", "PLN");

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={revenue}
        change={pct(data.totalRevenueChangePct)}
        direction={data.totalRevenueChangePct >= 0 ? "up" : "down"}
        footerMainText={
          data.totalRevenueChangePct >= 0
            ? "Trending up this period"
            : "Trending down this period"
        }
        footerSubText="Revenue vs previous period"
      />

      <StatCard
        title="New Customers"
        value={String(data.newCustomers)}
        change={pct(data.newCustomersChangePct)}
        direction={data.newCustomersChangePct >= 0 ? "up" : "down"}
        footerMainText={
          data.newCustomersChangePct >= 0
            ? "Acquisition improving"
            : "Acquisition down"
        }
        footerSubText="New signups vs previous period"
      />

      <StatCard
        title="Active Accounts"
        value={String(data.activeAccounts)}
        change={pct(data.activeAccountsChangePct)}
        direction={data.activeAccountsChangePct >= 0 ? "up" : "down"}
        footerMainText="Customers who ordered this period"
        footerSubText="Unique buyers vs previous period"
      />

      <StatCard
        title="Growth Rate"
        value={pct(data.revenueGrowthRatePct)}
        change={pct(data.revenueGrowthRatePct)}
        direction={data.revenueGrowthRatePct >= 0 ? "up" : "down"}
        footerMainText="Revenue growth vs last window"
        footerSubText="Same-length comparison"
      />
    </div>
  );
}
