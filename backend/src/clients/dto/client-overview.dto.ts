import { ClientOrderDto } from "./client-order.dto";
import { ClientStatsDto } from "./client-stats.dto";
import { ClientTopProduct } from "./client-top-products.dto";

export class ClientOverviewDto {
  stats: ClientStatsDto;
  topProducts: ClientTopProduct[];
  orders: ClientOrderDto[];
}
