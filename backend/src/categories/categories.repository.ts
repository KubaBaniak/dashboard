import { Injectable } from "@nestjs/common";
import { Category, Prisma } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PagedArgs } from "src/common/dto/paged-args.dto";
import { CategoryOptionRow, FindPagedResult } from "./types/types";

@Injectable()
export class CategoriesRepository {
  constructor(private prismaService: PrismaService) {}

  createCategory(data: { name: string; description?: string }): Promise<Category> {
    return this.prismaService.category.create({ data });
  }

  async findPaged({ skip, take, q }: PagedArgs): Promise<FindPagedResult> {
    const where: Prisma.CategoryWhereInput | undefined = q
      ? {
          OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
        }
      : undefined;

    const [total, rows] = await this.prismaService.$transaction([
      this.prismaService.category.count({ where }),
      this.prismaService.category.findMany({
        where,
        skip,
        take,
        orderBy: { name: "desc" },
        select: {
          id: true,
          name: true,
          description: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    return { rows, total };
  }

  findOptions(): Promise<CategoryOptionRow[]> {
    return this.prismaService.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
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

  countCategoriesById(categoryIds: number[]): Promise<number> {
    return this.prismaService.category.count({
      where: {
        id: { in: categoryIds },
      },
    });
  }
}
