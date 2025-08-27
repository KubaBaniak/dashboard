import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem, Prisma } from "@prisma/client";
import { DbClient } from "src/common/types/db";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderItemWithProduct } from "./types/types";

@Injectable()
export class OrderItemsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrderItemDto, productPrice: Decimal): Promise<OrderItem> {
    const { orderId, productId, quantity } = data;
    return this.prisma.$transaction(async tx => {
      const created = await tx.orderItem.create({
        data: {
          orderId,
          productId,
          quantity,
          price: productPrice,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stockQuantity: { decrement: quantity },
        },
      });

      return created;
    });
  }

  async createOrderItem(
    orderId: number,
    line: { productId: number; quantity: number; unitPrice: Prisma.Decimal | number | string },
    db: DbClient = this.prisma,
  ) {
    return db.orderItem.create({
      data: {
        orderId,
        productId: line.productId,
        quantity: line.quantity,
        price: new Prisma.Decimal(line.unitPrice).toFixed(2),
      },
    });
  }

  getAll(): Promise<OrderItem[]> {
    return this.prisma.orderItem.findMany();
  }

  getById(id: number): Promise<OrderItem | null> {
    return this.prisma.orderItem.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateOrderItemDto): Promise<OrderItem> {
    return this.prisma.orderItem.update({
      where: { id },
      data,
    });
  }

  delete(id: number, productId: number, qty: number): Promise<OrderItem> {
    return this.prisma.$transaction(async tx => {
      const deleted = await tx.orderItem.delete({
        where: { id },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stockQuantity: { increment: qty },
        },
      });

      return deleted;
    });
  }

  findItemsByOrderId(orderId: number): Promise<OrderItemWithProduct[]> {
    return this.prisma.orderItem.findMany({
      where: { orderId },
      include: {
        product: { select: { id: true, title: true, sku: true } },
      },
      orderBy: { id: "asc" },
    });
  }
}
