import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateDeliveryDto {
  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
