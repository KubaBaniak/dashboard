import { IsOptional, IsString, IsInt, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { UpdateOrderItemDto } from "../../order-items/dto/update-order-item.dto";

export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  buyerId?: number;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}
