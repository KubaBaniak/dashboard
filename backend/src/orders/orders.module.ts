import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { PrismaService } from "../database/prisma.service";
import { OrdersController } from "./orders.controller";
import { OrdersRepository } from "./orders.repository";
import { ClientsService } from "../clients/clients.service";
import { ClientsRepository } from "../clients/clients.repository";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, PrismaService, ClientsService, ClientsRepository],
})
export class OrdersModule {}
