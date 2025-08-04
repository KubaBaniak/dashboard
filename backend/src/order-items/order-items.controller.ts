import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { OrderItemsService } from "./order-items.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { OrderItem } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";

@UseGuards(JwtAuthGuard)
@Controller("order-items")
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<OrderItem[]> {
    return this.orderItemsService.getAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  getById(@Param("id", ParseIntPipe) id: number): Promise<OrderItem> {
    return this.orderItemsService.getById(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  delete(@Param("id", ParseIntPipe) id: number): Promise<OrderItem> {
    return this.orderItemsService.delete(id);
  }
}
