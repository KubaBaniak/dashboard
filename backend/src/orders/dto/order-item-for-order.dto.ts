import { IsInt, IsPositive } from "class-validator";

export class OrderItemForOrder {
  @IsInt()
  productId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}
