export class ClientStatsDto {
  totalOrders: number;
  lifetimeSpend: number;
  averageOrderValue: number;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
  ordersPerMonth: number | null;
}
