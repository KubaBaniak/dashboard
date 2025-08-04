import { Module } from "@nestjs/common";
import { DeliveriesController } from "./deliveries.controller";
import { DeliveriesService } from "./deliveries.service";
import { DeliveriesRepository } from "./deliveries.repository";
import { PrismaService } from "src/database/prisma.service";
import { ProductsService } from "src/products/products.service";
import { ProductsRepository } from "src/products/products.repository";
import { CategoriesService } from "src/categories/categories.service";
import { CategoriesRepository } from "src/categories/categories.repository";

@Module({
  controllers: [DeliveriesController],
  providers: [
    DeliveriesService,
    DeliveriesRepository,
    PrismaService,
    ProductsService,
    ProductsRepository,
    CategoriesService,
    CategoriesRepository,
  ],
})
export class DeliveriesModule {}
