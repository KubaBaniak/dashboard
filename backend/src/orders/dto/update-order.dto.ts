import { IsOptional, IsString, IsInt, ValidateNested, IsArray, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { UpdateOrderItemDto } from "../../order-items/dto/update-order-item.dto";
import { OrderStatus } from "@prisma/client";

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

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
