import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-guard";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { Delivery } from "@prisma/client";
import { DeliveriesService } from "./deliveries.service";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";

@UseGuards(JwtAuthGuard)
@Controller("deliveries")
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createDelivery(@Body() payload: CreateDeliveryDto): Promise<Delivery> {
    return this.deliveriesService.createDelivery(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  getDeliveryById(@Param("id", ParseIntPipe) deliveryId: number): Promise<Delivery> {
    return this.deliveriesService.getDeliveryById(deliveryId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllDeliveries(): Promise<Delivery[]> {
    return this.deliveriesService.getDeliveries();
  }

  @HttpCode(HttpStatus.OK)
  @Patch(":id")
  updateDeliveryById(
    @Param("id", ParseIntPipe) deliveryId: number,
    @Body() payload: UpdateDeliveryDto,
  ): Promise<Delivery> {
    return this.deliveriesService.updateDelivery(deliveryId, payload);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  deleteDeliveryById(@Param("id", ParseIntPipe) deliveryId: number): Promise<Delivery> {
    return this.deliveriesService.deleteDelivery(deliveryId);
  }
}
