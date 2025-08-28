import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderItemsRepository } from "./order-items.repository";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "@prisma/client";
import { ProductsService } from "../products/products.service";
import { OrdersService } from "../orders/orders.service";
import { DbClient } from "src/common/types/db";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderItemRowDto } from "./dto/order-item-row.dto";

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const [product, order] = await Promise.all([
      this.productsService.getProductById(dto.productId),
      this.ordersService.getOrderById(dto.orderId),
    ]);

    if (!product) {
      throw new NotFoundException("PRODUCT NOT FOUND");
    }

    if (product.stockQuantity < dto.quantity) {
      throw new BadRequestException("Provided quantity is bigger than the current stock quantity");
    }

    if (!order) {
      throw new NotFoundException("ORDER NOT FOUND");
    }

    return this.orderItemsRepository.create(dto, product.price);
  }

  createOnOrderCreation(
    orderId: number,
    line: { productId: number; quantity: number; unitPrice: Decimal },
    db?: DbClient,
  ): Promise<OrderItem> {
    return this.orderItemsRepository.createOrderItem(orderId, line, db);
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

  findOrderItemsWithBuyer() {
    return this.orderItemsRepository.findOrderItemsWithBuyer();
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
    return this.orderItemsRepository.delete(id, item.productId, item.quantity);
  }

  async findItemsByOrderId(orderId: number): Promise<OrderItemRowDto[]> {
    const rows = await this.orderItemsRepository.findItemsByOrderId(orderId);

    return rows.map(r => ({
      id: r.id,
      productId: r.productId,
      quantity: r.quantity,
      price: r.price.toString(),
      product: {
        id: r.product.id,
        title: r.product.title ?? null,
        sku: r.product.sku ?? null,
      },
    }));
  }
}
