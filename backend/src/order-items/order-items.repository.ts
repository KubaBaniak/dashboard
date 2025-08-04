import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "@prisma/client";

@Injectable()
export class OrderItemsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrderItemDto): Promise<OrderItem> {
    const { orderId, productId, quantity, price } = data;
    return this.prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
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
