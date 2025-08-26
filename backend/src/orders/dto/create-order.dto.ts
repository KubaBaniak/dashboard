import { IsInt, IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { OrderItemForOrder } from "./order-item-for-order.dto";

export class CreateOrderDto {
  @IsInt()
  buyerId: number;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemForOrder)
  items!: OrderItemForOrder[];
}
