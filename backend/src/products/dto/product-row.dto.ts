import { Expose, Transform, Type } from "class-transformer";

export class ProductCategoryDto {
  @Expose() id!: number;
  @Expose() name!: string;
}

export class ProductRowDto {
  @Expose() id!: number;
  @Expose() title!: string;
  @Expose() sku!: string;
  @Expose() stockQuantity!: number;

  @Expose()
  @Transform(({ value }) => Number(value).toFixed(2))
  price!: string;

  @Expose()
  @Type(() => ProductCategoryDto)
  categories!: ProductCategoryDto[];

  @Expose() createdAt!: Date;
  @Expose() updatedAt!: Date;
}
