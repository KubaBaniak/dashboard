import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, Order } from "@prisma/client";
import { OrdersRepository } from "./orders.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ClientsService } from "../clients/clients.service";
import { ListOrdersQueryDto } from "./dto/list-orders.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { OrderRowDto } from "./dto/order-row.dto";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly clientsService: ClientsService,
  ) {}
  async createOrder(data: CreateOrderDto): Promise<Order> {
    const client = await this.clientsService.getClientById(data.buyerId);

    if (!client) {
      throw new NotFoundException("CLIENT WITH SUCH ID DOES NOT EXISTS");
    }

    return this.ordersRepository.createOrder(data);
  }

  getAllOrders(query: ListOrdersQueryDto): Promise<PagedResponse<OrderRowDto>> {
    return this.ordersRepository.listOrders(query);
  }

  getOrderById(orderId: number): Promise<Order | null> {
    return this.ordersRepository.getOrderById(orderId);
  }

  async updateOrder(orderId: number, data: UpdateOrderDto): Promise<Order> {
    const existing = await this.getOrderById(orderId);
    if (!existing) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.ordersRepository.updateOrder(orderId, data);
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.ordersRepository.updateOrderStatus(orderId, status);
  }

  async deleteOrder(orderId: number): Promise<Order> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.ordersRepository.deleteOrder(orderId);
  }
}
