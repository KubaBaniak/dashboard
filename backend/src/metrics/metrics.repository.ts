import { Injectable } from "@nestjs/common";
import { OrderStatus } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class MetricsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOrdersWithItemsBetween(from: Date, to: Date, fulfilled: OrderStatus[]) {
    return this.prisma.order.findMany({
      where: { createdAt: { gte: from, lt: to }, status: { in: fulfilled } },
      include: { items: { select: { price: true, quantity: true } } },
    });
  }

  countNewClientsBetween(from: Date, to: Date) {
    return this.prisma.client.count({
      where: { createdAt: { gte: from, lt: to } },
    });
  }

  async countActiveBuyersBetween(from: Date, to: Date, fulfilled: OrderStatus[]) {
    const grouped = await this.prisma.order.groupBy({
      by: ["buyerId"],
      where: { createdAt: { gte: from, lt: to }, status: { in: fulfilled } },
    });
    return grouped.length;
  }
}
