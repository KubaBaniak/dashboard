import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsInt, Min } from "class-validator";

export class BulkDeleteClientsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(10000)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  ids: number[];
}
