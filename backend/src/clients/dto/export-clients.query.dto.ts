import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ExportClientsQueryDto {
  @IsString()
  @IsOptional()
  q?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1_000_000)
  @IsOptional()
  limit: number = 100_000;
}
