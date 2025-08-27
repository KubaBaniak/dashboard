import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, Order, Product, Prisma } from "@prisma/client";
import { OrdersRepository } from "./orders.repository";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ClientsService } from "../clients/clients.service";
import { ListOrdersQueryDto } from "./dto/list-orders.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { OrderRowDto } from "./dto/order-row.dto";
import {
  BuyerRecentOrder,
  BuyerStats,
  BuyerTopProduct,
  CreatedOrderWithItems,
  OrderItemForProductCreation,
  OrderItemRow,
  OrderWithItemsRow,
} from "./types/types";
import { ProductsService } from "src/products/products.service";
import { PrismaService } from "src/database/prisma.service";
import { OrderItemsService } from "src/order-items/order-items.service";
import { OrderItemRowDto } from "src/order-items/dto/order-item-row.dto";

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => OrderItemsService)) private readonly orderItemsService: OrderItemsService,
    @Inject(forwardRef(() => ClientsService)) private readonly clientsService: ClientsService,
  ) {}

  private mergeOrderItems(items: OrderItemForProductCreation[]): OrderItemForProductCreation[] {
    const map = new Map<number, number>();
    for (const it of items) map.set(it.productId, (map.get(it.productId) ?? 0) + it.quantity);
    return [...map.entries()].map(([productId, quantity]) => ({ productId, quantity }));
  }

  async createOrder(dto: CreateOrderDto): Promise<CreatedOrderWithItems> {
    if (!dto.items?.length) throw new BadRequestException("Order must contain at least one item.");

    const client = await this.clientsService.getClientById(dto.buyerId);
    if (!client) throw new NotFoundException("Client does not exist.");

    const merged = this.mergeOrderItems(dto.items);
    const ids = merged.map(i => i.productId);

    return this.prismaService.$transaction(
      async tx => {
        const products = await this.productsService.getProductsByIdList(ids, tx);
        if (!products) throw new NotFoundException();
        const byId = new Map<number, Product>(products.map((p: Product): [number, Product] => [p.id, p]));
        const missing = ids.filter(id => !byId.has(id));
        if (missing.length) throw new NotFoundException(`Products not found: ${missing.join(", ")}`);

        for (const it of merged) {
          const ok = await this.productsService.decrementStockConditional(it.productId, it.quantity, tx);
          if (!ok) {
            const p = byId.get(it.productId)!;
            throw new BadRequestException(
              `Insufficient stock for product ${it.productId} (requested ${it.quantity}, available ${p.stockQuantity})`,
            );
          }
        }

        const order = await this.ordersRepository.createOrder(
          {
            buyerId: dto.buyerId,
            shippingAddress: dto.shippingAddress,
            billingAddress: dto.billingAddress,
          },
          tx,
        );

        for (const it of merged) {
          const price = byId.get(it.productId)!.price;
          await this.orderItemsService.createOnOrderCreation(
            order.id,
            { productId: it.productId, quantity: it.quantity, unitPrice: price },
            tx,
          );
        }

        return this.ordersRepository.getOrderWithRelations(order.id, tx);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  getOrderById(orderId: number): Promise<Order | null> {
    return this.ordersRepository.getOrderById(orderId);
  }

  getAllOrders(query: ListOrdersQueryDto): Promise<PagedResponse<OrderRowDto>> {
    return this.ordersRepository.listOrders(query);
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

  private lifetime(items: OrderItemRow[]): number {
    return items.reduce((sum, it) => sum + Number(it.price) * (it.quantity ?? 0), 0);
  }

  private perMonth(first: Date | null, last: Date | null, totalOrders: number): number | null {
    if (!first || !last || totalOrders <= 1) return null;
    const months = (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
    return months > 0 ? totalOrders / months : null;
  }

  private recentOrders(orders: OrderWithItemsRow[]): BuyerRecentOrder[] {
    return orders.map(o => {
      const total = o.items.reduce((s, it) => s + Number(it.price) * (it.quantity ?? 0), 0);
      return { id: o.id, createdAt: o.createdAt.toISOString(), total };
    });
  }

  async getBuyerStats(buyerId: number): Promise<BuyerStats> {
    const [total, first, last, items] = await Promise.all([
      this.ordersRepository.countByBuyer(buyerId),
      this.ordersRepository.firstDateByBuyer(buyerId),
      this.ordersRepository.lastDateByBuyer(buyerId),
      this.ordersRepository.itemsForBuyer(buyerId),
    ]);

    const lifetimeSpend = this.lifetime(items);
    const averageOrderValue = total ? lifetimeSpend / total : 0;

    const firstAt = first?.createdAt ?? null;
    const lastAt = last?.createdAt ?? null;

    return {
      totalOrders: total,
      lifetimeSpend,
      averageOrderValue,
      firstOrderAt: firstAt ? firstAt.toISOString() : null,
      lastOrderAt: lastAt ? lastAt.toISOString() : null,
      ordersPerMonth: this.perMonth(firstAt, lastAt, total),
    };
  }

  async getBuyerTopProducts(buyerId: number, take = 3): Promise<BuyerTopProduct[]> {
    const agg = await this.ordersRepository.groupTopProductsByQuantityForBuyer(buyerId, take);
    const ids = agg.map(a => a.productId);
    const titles = await this.ordersRepository.productTitles(ids);
    const titleMap = new Map(titles.map(t => [t.id, t.title]));

    return agg.map(a => ({
      productId: a.productId,
      title: titleMap.get(a.productId) ?? null,
      quantity: a._sum.quantity ?? 0,
    }));
  }

  async getBuyerRecentOrders(buyerId: number, limit = 10): Promise<BuyerRecentOrder[]> {
    const rows = await this.ordersRepository.recentOrdersWithItemsByBuyer(buyerId, limit);
    return this.recentOrders(rows);
  }

  async getBuyerOverview(buyerId: number) {
    const [stats, topProducts, orders] = await Promise.all([
      this.getBuyerStats(buyerId),
      this.getBuyerTopProducts(buyerId, 3),
      this.getBuyerRecentOrders(buyerId, 10),
    ]);
    return { stats, topProducts, orders };
  }

  async getOrderItems(orderId: number): Promise<OrderItemRowDto[]> {
    const order = await this.ordersRepository.getOrderById(orderId);
    if (!order) throw new NotFoundException("No order with such ID");

    return this.orderItemsService.findItemsByOrderId(order.id);
  }
}
