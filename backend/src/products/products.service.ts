import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "@prisma/client";

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async createProduct(data: CreateProductDto): Promise<Product> {
    const product = await this.productsRepository.getProductBySku(data.sku);

    if (product) {
      throw new ConflictException("CANNOT CREATE PRODUCT - product with such sku already exists");
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
}
