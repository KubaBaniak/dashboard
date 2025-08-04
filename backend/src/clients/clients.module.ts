import { Module } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { ClientsRepository } from "./clients.repository";
import { PrismaService } from "../database/prisma.service";

@Module({
  providers: [ClientsService, ClientsRepository, PrismaService],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
