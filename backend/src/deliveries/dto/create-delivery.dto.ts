import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateDeliveryDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;
}
