import { IsInt, IsPositive } from "class-validator";

export class CreateOrderItemDto {
  @IsInt()
  orderId: number;

  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
