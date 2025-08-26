import { IsInt, IsNumber, IsPositive } from "class-validator";

export class AddOrderItemDto {
  @IsInt()
  orderId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}
