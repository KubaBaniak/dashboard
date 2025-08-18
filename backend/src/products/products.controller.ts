import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { Product } from "@prisma/client";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ListProductsQueryDto } from "./dto/list-products.dto";
import { PaginatedProductsDto } from "./dto/paginated-products.dto";
import { plainToInstance } from "class-transformer";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() payload: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(payload);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts(@Query() query: ListProductsQueryDto): Promise<PaginatedProductsDto> {
    const result = await this.productsService.listProducts(query);
    return plainToInstance(PaginatedProductsDto, result, { excludeExtraneousValues: true });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getProductById(@Param("id") productId: string): Promise<Product | null> {
    return this.productsService.getProductById(+productId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch("/:id")
  updateProduct(@Param("id") productId: string, @Body() productData: UpdateProductDto): Promise<Product | null> {
    return this.productsService.updateProduct(+productId, productData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  deleteProdut(@Param("id") productId: string): Promise<Product> {
    return this.productsService.deleteProduct(+productId);
  }
}
