import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";
import { MetricsRepository } from "./metrics.repository";
import { DashboardStatsDto } from "./dto/get-dashboard-stats.dto";

type Period = "7d" | "30d" | "90d";

@Injectable()
export class MetricsService {
  constructor(private readonly repo: MetricsRepository) {}

  private range(period: Period) {
    const now = new Date();
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;

    const start = new Date(now);
    start.setDate(now.getDate() - days);

    const prevStart = new Date(start);
    prevStart.setDate(start.getDate() - days);

    const prevEnd = start;

    return { now, start, prevStart, prevEnd };
  }

  private sumRevenue(items: { price: Prisma.Decimal; quantity: number }[]) {
    return items.reduce((acc, it) => acc + Number(it.price) * it.quantity, 0);
  }

  private pctChange(curr: number, prev: number) {
    if (!prev) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  }

  async getDashboardStats(period: Period = "30d"): Promise<DashboardStatsDto> {
    const { start, now, prevStart, prevEnd } = this.range(period);
    const FULFILLED: OrderStatus[] = ["PAID", "SHIPPED"];

    const [ordersNow, newClientsNow, activeNow] = await Promise.all([
      this.repo.findOrdersWithItemsBetween(start, now, FULFILLED),
      this.repo.countNewClientsBetween(start, now),
      this.repo.countActiveBuyersBetween(start, now, FULFILLED),
    ]);
    const revenueNow = this.sumRevenue(ordersNow.flatMap(o => o.items));

    const [ordersPrev, newClientsPrev, activePrev] = await Promise.all([
      this.repo.findOrdersWithItemsBetween(prevStart, prevEnd, FULFILLED),
      this.repo.countNewClientsBetween(prevStart, prevEnd),
      this.repo.countActiveBuyersBetween(prevStart, prevEnd, FULFILLED),
    ]);
    const revenuePrev = this.sumRevenue(ordersPrev.flatMap(o => o.items));

    return {
      totalRevenue: revenueNow,
      totalRevenueChangePct: this.pctChange(revenueNow, revenuePrev),

      newCustomers: newClientsNow,
      newCustomersChangePct: this.pctChange(newClientsNow, newClientsPrev),

      activeAccounts: activeNow,
      activeAccountsChangePct: this.pctChange(activeNow, activePrev),

      revenueGrowthRatePct: this.pctChange(revenueNow, revenuePrev),
    };
  }
}
