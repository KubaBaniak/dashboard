import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-guard";
import { Order } from "@prisma/client";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ListOrdersQueryDto } from "./dto/list-orders.dto";
import { PaginatedOrders } from "./dto/return-orders.dto";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllOrders(@Query() query: ListOrdersQueryDto): Promise<PaginatedOrders> {
    return this.ordersService.getAllOrders(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  getOrderById(@Param("id") id: string): Promise<Order | null> {
    return this.ordersService.getOrderById(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  deleteOrder(@Param("id") id: string): Promise<Order> {
    return this.ordersService.deleteOrder(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(":id")
  updateOrder(@Param("id") id: string, @Body() dto: UpdateOrderDto): Promise<Order> {
    return this.ordersService.updateOrder(+id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(":id/status")
  updateOrderStatus(@Param("id") id: string, @Body() dto: UpdateOrderStatusDto): Promise<Order> {
    return this.ordersService.updateOrderStatus(+id, dto.status);
  }
}
