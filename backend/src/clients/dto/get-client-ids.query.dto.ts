import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetClientIdsQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100_000)
  @IsOptional()
  limit: number = 10_000;
}
