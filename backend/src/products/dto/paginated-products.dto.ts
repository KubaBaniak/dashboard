import { Expose, Type } from "class-transformer";
import { ProductRowDto } from "./product-row.dto";

export class PaginatedProductsDto {
  @Expose() page!: number;
  @Expose() pageSize!: number;
  @Expose() total!: number;

  @Expose()
  @Type(() => ProductRowDto)
  data!: ProductRowDto[];
}
