import { forwardRef, Module } from "@nestjs/common";
import { OrderItemsService } from "./order-items.service";
import { OrderItemsController } from "./order-items.controller";
import { OrderItemsRepository } from "./order-items.repository";
import { PrismaService } from "../database/prisma.service";
import { ProductsModule } from "../products/products.module";
import { CategoriesModule } from "../categories/categories.module";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [ProductsModule, forwardRef(() => OrdersModule), CategoriesModule],
  providers: [OrderItemsService, OrderItemsRepository, PrismaService],
  controllers: [OrderItemsController],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
