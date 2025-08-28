import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Prisma, Product } from "@prisma/client";
import { QueryProductsResult } from "./types/productsWithCategories";
import { ProductOptionDto } from "./dto/product-option.dto";
import { DbClient } from "src/common/types/db";

@Injectable()
export class ProductsRepository {
  constructor(private prismaService: PrismaService) {}

  createProduct(data: CreateProductDto): Promise<Product> {
    const { title, description, sku, stockQuantity, price, categoryIds } = data;

    return this.prismaService.product.create({
      data: {
        title,
        description,
        sku,
        stockQuantity,
        price,
        categories: {
          connect: categoryIds?.map(id => ({ id })),
        },
      },
    });
  }

  findProductBySku(sku: string): Promise<Product | null> {
    return this.prismaService.product.findUnique({ where: { sku } });
  }

  findProductsByTitle(title: string): Promise<Product[] | null> {
    return this.prismaService.product.findMany({ where: { title } });
  }

  async queryProducts(where: Prisma.ProductWhereInput, page: number, pageSize: number): Promise<QueryProductsResult> {
    const [total, rows] = await Promise.all([
      this.prismaService.product.count({ where }),
      this.prismaService.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { categories: { select: { id: true, name: true } } },
      }),
    ]);
    return { total, rows };
  }

  async findManyByIds(ids: number[], db: DbClient = this.prismaService): Promise<Product[]> {
    return db.product.findMany({
      where: { id: { in: ids } },
    });
  }

  findOptions(): Promise<ProductOptionDto[]> {
    return this.prismaService.product.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });
  }

  getProductById(id: number): Promise<Product | null> {
    return this.prismaService.product.findUnique({ where: { id } });
  }

  getProductBySku(sku: string): Promise<Product | null> {
    return this.prismaService.product.findUnique({ where: { sku } });
  }

  updateProduct(productId: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prismaService.product.update({
      where: { id: productId },
      data,
    });
  }

  updateProductInTx(
    tx: Prisma.TransactionClient,
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return tx.product.update({
      where: { id: productId },
      data,
    });
  }

  deleteProduct(productId: number): Promise<Product> {
    return this.prismaService.$transaction(async tx => {
      await tx.orderItem.deleteMany({
        where: { productId },
      });

      await tx.order.deleteMany({
        where: { items: { none: {} } },
      });

      return tx.product.delete({ where: { id: productId } });
    });
  }

  getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: {
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
    });
  }

  decrementStock(productId: number, qty: number, db: DbClient = this.prismaService): Promise<Prisma.BatchPayload> {
    return db.product.updateMany({
      where: { id: productId, stockQuantity: { gte: qty } },
      data: { stockQuantity: { decrement: qty } },
    });
  }
}
