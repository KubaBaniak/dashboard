import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ListOrdersQueryDto } from "./dto/list-orders.dto";
import { OrderRowDto } from "./dto/order-row.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: {
        buyerId: data.buyerId,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
      },
      include: {
        items: true,
      },
    });
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
}
