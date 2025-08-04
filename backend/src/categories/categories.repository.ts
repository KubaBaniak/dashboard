import { Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesRepository {
  constructor(private prismaService: PrismaService) {}

  createCategory(data: { name: string; description?: string }): Promise<Category> {
    return this.prismaService.category.create({
      data,
    });
  }

  getAllCategories(): Promise<Category[]> {
    return this.prismaService.category.findMany();
  }

  getCategoryById(categoryId: number): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { id: categoryId },
    });
  }

  updateCategory(categoryId: number, data: UpdateCategoryDto): Promise<Category> {
    return this.prismaService.category.update({
      where: { id: categoryId },
      data,
    });
  }

  deleteCategory(categoryId: number): Promise<Category> {
    return this.prismaService.category.delete({
      where: { id: categoryId },
    });
  }
}
