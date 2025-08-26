import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem, Prisma } from "@prisma/client";
import { DbClient } from "src/common/types/db";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class OrderItemsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrderItemDto, productPrice: Decimal): Promise<OrderItem> {
    const { orderId, productId, quantity } = data;
    return this.prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price: productPrice,
      },
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

  delete(id: number): Promise<OrderItem> {
    return this.prisma.orderItem.delete({
      where: { id },
    });
  }
}
