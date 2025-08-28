import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Prisma, Product } from "@prisma/client";
import { CategoriesService } from "../categories/categories.service";
import { ListProductsQueryDto } from "./dto/list-products.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { ProductRowDto } from "./dto/product-row.dto";
import { ProductOptionDto } from "./dto/product-option.dto";
import { DbClient } from "src/common/types/db";

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesService: CategoriesService,
  ) {}

  async createProduct(data: CreateProductDto): Promise<Product> {
    const product = await this.productsRepository.getProductBySku(data.sku);

    if (product) {
      throw new ConflictException("CANNOT CREATE PRODUCT - product with such sku already exists");
    }

    const areCategoriesValid = await this.categoriesService.validateMultipleCategories(data.categoryIds);
    if (!areCategoriesValid) {
      throw new BadRequestException("Some category IDs are invalid");
    }

    return this.productsRepository.createProduct(data);
  }

  async listProducts(query: ListProductsQueryDto): Promise<PagedResponse<ProductRowDto>> {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
    const q = (query.q ?? "").trim();
    const categoryId = query.categoryId;

    const where: Prisma.ProductWhereInput = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { categories: { some: { name: { contains: q, mode: "insensitive" } } } },
      ];
    }
    if (categoryId) where.categories = { some: { id: categoryId } };

    const { total, rows } = await this.productsRepository.queryProducts(where, page, pageSize);

    const data = rows.map(p => ({
      id: p.id,
      title: p.title,
      sku: p.sku,
      stockQuantity: p.stockQuantity,
      price: p.price.toFixed(2),
      categories: p.categories,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return { data, page, pageSize, total };
  }

  async getOptions(): Promise<ProductOptionDto[]> {
    const rows = await this.productsRepository.findOptions();
    return rows.map(r => ({ id: r.id, title: r.title }));
  }

  getProductBySku(sku: string): Promise<Product | null> {
    return this.productsRepository.getProductBySku(sku);
  }

  getProductById(id: number): Promise<Product | null> {
    return this.productsRepository.getProductById(id);
  }

  getProductsByIdList(ids: number[], db?: DbClient): Promise<Product[]> | [] {
    return this.productsRepository.findManyByIds(ids, db);
  }

  async updateProduct(productId: number, dto: UpdateProductDto): Promise<Product> {
    const current = await this.productsRepository.getProductById(productId);
    if (!current) {
      throw new NotFoundException("CANNOT UPDATE PRODUCT - no product with such ID");
    }

    const data: Prisma.ProductUpdateInput = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.sku !== undefined) data.sku = dto.sku;

    if (dto.price !== undefined) {
      if (dto.price <= 0) throw new BadRequestException("Price must be positive");
      data.price = new Prisma.Decimal(dto.price);
    }

    if (dto.stockQuantity !== undefined) {
      if (dto.stockQuantity < 0) throw new BadRequestException("Stock cannot be negative");
      const delta = dto.stockQuantity - current.stockQuantity;
      if (delta !== 0) {
        data.stockQuantity = delta > 0 ? { increment: delta } : { decrement: Math.abs(delta) };
      }
    }

    if (dto.categoryIds !== undefined) {
      const unique = Array.from(new Set(dto.categoryIds));
      data.categories = { set: unique.map(id => ({ id })) };
    }

    return this.productsRepository.updateProduct(productId, data);
  }

  async deleteProduct(productId: number): Promise<Product> {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new NotFoundException("CANNOT DELETE PRODUCT - no product with such ID");
    }

    return this.productsRepository.deleteProduct(productId);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    const products = await this.productsRepository.getProductsByCategoryId(categoryId);

    if (!products || products.length === 0) {
      throw new NotFoundException("NO PRODUCTS FOUND FOR SUCH CATEGORY");
    }

    return products;
  }

  async updateQuantity(tx: Prisma.TransactionClient, productId: number, changeInQty: number): Promise<Product> {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new NotFoundException("NO PRODUCT FOUND - CANNOT UPDATE QTY");
    }

    const updatedQty = product.stockQuantity + changeInQty;

    if (updatedQty < 0) {
      throw new BadRequestException("INSUFFICIENT STOCK - CANNOT DECREASE BELOW ZERO");
    }

    return this.productsRepository.updateProductInTx(tx, productId, { stockQuantity: updatedQty });
  }

  async decrementStockConditional(productId: number, qty: number, db?: DbClient): Promise<boolean> {
    const res = await this.productsRepository.decrementStock(productId, qty, db);
    return res.count === 1;
  }
}
