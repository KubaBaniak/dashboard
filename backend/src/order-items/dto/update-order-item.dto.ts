import { IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";

export class UpdateOrderItemDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;
}
