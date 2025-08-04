import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { Prisma, Product } from "@prisma/client";

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

  getAllProducts(): Promise<Product[] | null> {
    return this.prismaService.product.findMany();
  }

  getProductById(id: number): Promise<Product | null> {
    return this.prismaService.product.findUnique({ where: { id } });
  }

  getProductBySku(sku: string): Promise<Product | null> {
    return this.prismaService.product.findUnique({ where: { sku } });
  }

  updateProduct(productId: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prismaService.product.update({ where: { id: productId }, data });
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
    return this.prismaService.product.delete({ where: { id: productId } });
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
}
