import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { Order, OrderStatus } from "@prisma/client";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

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
}
