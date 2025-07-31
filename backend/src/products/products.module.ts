import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { PrismaService } from "../database/prisma.service";
import { ProductsController } from "./products.controller";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
