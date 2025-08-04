import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { PrismaService } from "../database/prisma.service";
import { ProductsController } from "./products.controller";
import { CategoriesService } from "../categories/categories.service";
import { CategoriesRepository } from "../categories/categories.repository";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, PrismaService, CategoriesService, CategoriesRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
