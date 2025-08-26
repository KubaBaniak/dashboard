import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ListOrdersQueryDto } from "./dto/list-orders.dto";
import { OrderRowDto } from "./dto/order-row.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import {
  CreatedOrderWithItems,
  OrderItemRow,
  OrderWithItemsRow,
  ProductTitleRow,
  TopProductAggRow,
} from "./types/types";
import { DbClient } from "src/common/types/db";

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    data: { buyerId: number; shippingAddress: string; billingAddress: string },
    db: DbClient = this.prisma,
  ) {
    return db.order.create({ data, select: { id: true } });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
    });
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  getOrderWithRelations(orderId: number, db: DbClient = this.prisma): Promise<CreatedOrderWithItems> {
    return db.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { buyer: true, items: { include: { product: { select: { id: true, title: true, sku: true } } } } },
    });
  }

  async updateOrder(id: number, data: UpdateOrderDto): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: {
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
      },
      include: {
        items: true,
      },
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: {
        items: true,
      },
    });
  }

  async deleteOrder(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async listOrders(query: ListOrdersQueryDto): Promise<PagedResponse<OrderRowDto>> {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
    const q = (query.q ?? "").trim();
    const status = query.status ?? "";

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (q) {
      const maybeId = Number(q);
      where.OR = [
        { buyer: { name: { contains: q, mode: "insensitive" } } },
        { buyer: { email: { contains: q, mode: "insensitive" } } },
        ...(Number.isFinite(maybeId) ? [{ id: maybeId }] : []),
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          buyer: { select: { name: true, email: true } },
          items: { select: { quantity: true, price: true } },
        },
      }),
    ]);

    const data: OrderRowDto[] = rows.map(o => {
      const totalAmount = o.items.reduce((acc, it) => acc + Number(it.price) * it.quantity, 0);
      const itemCount = o.items.reduce((acc, it) => acc + it.quantity, 0);

      return {
        id: o.id,
        createdAt: o.createdAt.toISOString(),
        buyerName: o.buyer?.name ?? null,
        buyerEmail: o.buyer?.email ?? "",
        status: o.status,
        itemCount,
        totalAmount: totalAmount.toFixed(2),
      };
    });

    return { data, page, pageSize, total };
  }

  countByBuyer(buyerId: number): Promise<number> {
    return this.prisma.order.count({ where: { buyerId } });
  }

  firstDateByBuyer(buyerId: number): Promise<{ createdAt: Date } | null> {
    return this.prisma.order.findFirst({
      where: { buyerId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
  }

  lastDateByBuyer(buyerId: number): Promise<{ createdAt: Date } | null> {
    return this.prisma.order.findFirst({
      where: { buyerId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
  }

  itemsForBuyer(buyerId: number): Promise<OrderItemRow[]> {
    return this.prisma.orderItem.findMany({
      where: { order: { buyerId } },
      select: { quantity: true, price: true },
    });
  }

  async groupTopProductsByQuantityForBuyer(clientId: number, take = 3): Promise<TopProductAggRow[]> {
    const rows = await this.prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { buyerId: clientId } },
      _sum: { quantity: true },
      orderBy: [{ _sum: { quantity: "desc" } }],
      take,
    });

    const result = rows.map(r => ({
      productId: r.productId,
      _sum: { quantity: r._sum?.quantity ?? 0 },
    }));

    return result;
  }

  productTitles(ids: number[]): Promise<ProductTitleRow[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true },
    });
  }

  recentOrdersWithItemsByBuyer(buyerId: number, limit = 10): Promise<OrderWithItemsRow[]> {
    return this.prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        items: { select: { quantity: true, price: true } },
      },
    });
  }
}
