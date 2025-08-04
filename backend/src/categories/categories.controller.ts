import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "@prisma/client";
import { CategoriesService } from "./categories.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  createCategory(@Body() payload: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createCategory(payload);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
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
}
