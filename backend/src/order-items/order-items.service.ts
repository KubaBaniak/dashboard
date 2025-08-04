import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderItemsRepository } from "./order-items.repository";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "@prisma/client";
import { ProductsService } from "../products/products.service";
import { OrdersService } from "../orders/orders.service";

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const [product, order] = await Promise.all([
      this.productsService.getProductById(dto.productId),
      this.ordersService.getOrderById(dto.orderId),
    ]);

    if (!product) {
      throw new NotFoundException("PRODUCT NOT FOUND");
    }

    if (!order) {
      throw new NotFoundException("ORDER NOT FOUND");
    }

    return this.orderItemsRepository.create(dto);
  }

  getAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.getAll();
  }

  async getById(id: number): Promise<OrderItem> {
    const item = await this.orderItemsRepository.getById(id);

    if (!item) {
      throw new NotFoundException("CANNOT FIND SUCH ORDER ITEM");
    }

    return item;
  }

  async update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const item = await this.orderItemsRepository.getById(id);
    if (!item) {
      throw new NotFoundException("CANNOT UPDATE ORDER ITEM - ORDER ITEM NOT FOUND");
    }
    return this.orderItemsRepository.update(id, dto);
  }

  async delete(id: number): Promise<OrderItem> {
    const item = await this.orderItemsRepository.getById(id);
    if (!item) {
      throw new NotFoundException("CANNOT DELETE ORDER ITEM - ORDER ITEM NOT FOUND");
    }
    return this.orderItemsRepository.delete(id);
  }
}
