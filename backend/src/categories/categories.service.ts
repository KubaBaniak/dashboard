import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "@prisma/client";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  createCategory(payload: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.createCategory(payload);
  }

  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.getAllCategories();
  }

  getCategoryById(categoryId: number): Promise<Category | null> {
    return this.categoriesRepository.getCategoryById(categoryId);
  }

  async updateCategory(categoryId: number, payload: UpdateCategoryDto): Promise<Category | null> {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException("CANNOT UPDATE CATEGORY - no category with such ID");
    }

    return this.categoriesRepository.updateCategory(categoryId, payload);
  }

  async deleteCategory(categoryId: number): Promise<Category> {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException("CANNOT DELETE CATEGORY - no category with such ID");
    }

    return this.categoriesRepository.deleteCategory(categoryId);
  }
}
