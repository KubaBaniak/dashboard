import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { PrismaService } from "../database/prisma.service";
import { CategoriesRepository } from "./categories.repository";
import { ProductsService } from "../products/products.service";
import { ProductsRepository } from "../products/products.repository";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, PrismaService, ProductsService, ProductsRepository],
})
export class CategoriesModule {}
