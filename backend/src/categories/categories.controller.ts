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
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category, Product } from "@prisma/client";
import { CategoriesService } from "./categories.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ProductsService } from "../products/products.service";
import { GetCategoriesQueryDto } from "./dto/get-categories.query.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { CategoryRowDto } from "./dto/category-row.dto";
import { CategoryOptionDto } from "./dto/category-option.dto";

@Controller("categories")
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  createCategory(@Body() payload: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getCategories(@Query() query: GetCategoriesQueryDto): Promise<PagedResponse<CategoryRowDto>> {
    return this.categoriesService.getList(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get("options")
  async getCategoryOptions(): Promise<CategoryOptionDto[]> {
    return this.categoriesService.getOptions();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getCategoryById(@Param("id") categoryId: string): Promise<Category | null> {
    return this.categoriesService.getCategoryById(+categoryId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch("/:id")
  updateCategory(@Param("id") categoryId: string, @Body() categoryData: UpdateCategoryDto): Promise<Category | null> {
    return this.categoriesService.updateCategory(+categoryId, categoryData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  deleteCategory(@Param("id") categoryId: string): Promise<Category> {
    return this.categoriesService.deleteCategory(+categoryId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:id/products")
  getProductsByCategory(@Param("id") categoryId: string): Promise<Product[]> {
    return this.productsService.getProductsByCategoryId(+categoryId);
  }
}
