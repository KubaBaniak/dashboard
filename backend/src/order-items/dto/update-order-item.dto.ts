import { IsInt, Min } from "class-validator";

export class UpdateOrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  price: number;
}
