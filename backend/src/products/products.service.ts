import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "@prisma/client";
import { CategoriesService } from "../categories/categories.service";

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

  getAllProducts(): Promise<Product[] | null> {
    return this.productsRepository.getAllProducts();
  }

  getProductBySku(sku: string): Promise<Product | null> {
    return this.productsRepository.getProductBySku(sku);
  }

  getProductById(id: number): Promise<Product | null> {
    return this.productsRepository.getProductById(id);
  }

  async updateProduct(productId: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new NotFoundException("CANNOT UPDATE PRODUCT - no product with such ID");
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
}
