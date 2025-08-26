import { forwardRef, Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { PrismaService } from "../database/prisma.service";
import { OrdersController } from "./orders.controller";
import { OrdersRepository } from "./orders.repository";
import { ClientsModule } from "../clients/clients.module";
import { ProductsModule } from "../products/products.module";
import { OrderItemsModule } from "../order-items/order-items.module";

@Module({
  imports: [forwardRef(() => ClientsModule), forwardRef(() => OrderItemsModule), ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PrismaService],
  exports: [OrdersService],
})
export class OrdersModule {}
