import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, IsString, Max } from "class-validator";

export class GetDeliveriesQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number = 10;

  @IsString()
  @IsOptional()
  q?: string = "";
}
