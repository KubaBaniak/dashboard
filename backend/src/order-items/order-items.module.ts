import { Module } from "@nestjs/common";
import { OrderItemsService } from "./order-items.service";
import { OrderItemsController } from "./order-items.controller";
import { OrderItemsRepository } from "./order-items.repository";
import { PrismaService } from "../database/prisma.service";
import { ProductsService } from "../products/products.service";
import { OrdersService } from "../orders/orders.service";
import { ProductsRepository } from "../products/products.repository";
import { CategoriesService } from "../categories/categories.service";
import { OrdersRepository } from "../orders/orders.repository";
import { ClientsService } from "../clients/clients.service";
import { ClientsRepository } from "../clients/clients.repository";
import { CategoriesRepository } from "../categories/categories.repository";

@Module({
  providers: [
    OrderItemsService,
    OrderItemsRepository,
    PrismaService,
    ProductsService,
    ProductsRepository,
    OrdersService,
    OrdersRepository,
    CategoriesService,
    CategoriesRepository,
    ClientsService,
    ClientsRepository,
  ],
  controllers: [OrderItemsController],
})
export class OrderItemsModule {}
