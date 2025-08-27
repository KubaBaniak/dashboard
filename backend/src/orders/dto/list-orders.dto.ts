import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "@prisma/client";

export class ListOrdersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  status?: OrderStatus | "";

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  buyerId?: number;
}
