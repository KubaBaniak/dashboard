import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "@prisma/client";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { GetCategoriesQueryDto } from "./dto/get-categories.query.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { CategoryRowDto } from "./dto/category-row.dto";
import { CategoryOptionDto } from "./dto/category-option.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  createCategory(payload: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.createCategory(payload);
  }

  async getList(query: GetCategoriesQueryDto): Promise<PagedResponse<CategoryRowDto>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 10));
    const skip = (page - 1) * pageSize;
    const q = (query.q ?? "").trim();

    const { rows, total } = await this.categoriesRepository.findPaged({
      skip,
      take: pageSize,
      q: q || undefined,
    });

    const data: CategoryRowDto[] = rows.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description ?? null,
      productCount: r._count?.products ?? 0,
    }));

    return { data, page, pageSize, total };
  }

  async getOptions(): Promise<CategoryOptionDto[]> {
    const rows = await this.categoriesRepository.findOptions();
    return rows.map(r => ({ id: r.id, name: r.name }));
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

  async validateMultipleCategories(categoryIds: number[]): Promise<boolean> {
    const count = await this.categoriesRepository.countCategoriesById(categoryIds);

    return count === categoryIds.length;
  }
}
