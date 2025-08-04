import { IsInt, IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "../../order-items/dto/create-order-item.dto";

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
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
