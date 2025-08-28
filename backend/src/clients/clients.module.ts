import { forwardRef, Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { ClientsRepository } from "./clients.repository";
import { PrismaService } from "../database/prisma.service";
import { OrdersModule } from "../orders/orders.module";
import { OrderItemsModule } from "../order-items/order-items.module";

@Module({
  imports: [forwardRef(() => OrdersModule), OrderItemsModule],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository, PrismaService],
  exports: [ClientsService],
})
export class ClientsModule {}
