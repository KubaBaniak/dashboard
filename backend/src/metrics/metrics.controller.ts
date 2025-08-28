import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import type { DashboardStatsDto, DashboardStatsQuery } from "./dto/get-dashboard-stats.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";

@Controller("metrics")
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @HttpCode(HttpStatus.OK)
  @Get("dashboard")
  getDashboard(@Query() query: DashboardStatsQuery): Promise<DashboardStatsDto> {
    return this.metricsService.getDashboardStats(query?.period ?? "30d");
  }
}
