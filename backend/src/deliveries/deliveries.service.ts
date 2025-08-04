import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { ProductsService } from "src/products/products.service";
import { Delivery } from "@prisma/client";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";
import { DeliveriesRepository } from "./deliveries.repository";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly deliveriesRepository: DeliveriesRepository,
    private readonly productsService: ProductsService,
    private prisma: PrismaService,
  ) {}

  async createDelivery(data: CreateDeliveryDto): Promise<Delivery> {
    const product = await this.productsService.getProductById(data.productId);

    if (!product) {
      throw new NotFoundException("NO SUCH PRODUCT (DELIVERY)");
    }

    const updatedQty = product.stockQuantity + data.quantity;

    return this.deliveriesRepository.create(updatedQty, data);
  }

  async getDeliveryById(deliveryId: number): Promise<Delivery> {
    const delivery = await this.deliveriesRepository.getById(deliveryId);

    if (!delivery) {
      throw new NotFoundException("NO SUCH PRODUCT (DELIVERY)");
    }

    return delivery;
  }

  async getDeliveries(): Promise<Delivery[]> {
    return this.deliveriesRepository.getAll();
  }

  async updateDelivery(id: number, data: UpdateDeliveryDto): Promise<Delivery> {
    const existingDelivery = await this.getDeliveryById(id);
    if (!existingDelivery) throw new NotFoundException("DELIVERY NOT FOUND");

    const newProductId = data.productId ?? existingDelivery.productId;
    const newQuantity = data.quantity ?? existingDelivery.quantity;

    if (newProductId !== existingDelivery.productId) {
      const newProduct = await this.productsService.getProductById(newProductId);
      if (!newProduct) throw new NotFoundException("NEW PRODUCT NOT FOUND");
    }

    if (newProductId !== existingDelivery.productId || newQuantity !== existingDelivery.quantity) {
      return this.prisma.$transaction(async tx => {
        await this.productsService.updateQuantity(tx, existingDelivery.productId, -existingDelivery.quantity);
        await this.productsService.updateQuantity(tx, newProductId, newQuantity);
        return this.deliveriesRepository.updateInTx(tx, id, data);
      });
    }

    return this.deliveriesRepository.update(id, data);
  }

  async deleteDelivery(deliveryId: number): Promise<Delivery> {
    const delivery = await this.getDeliveryById(deliveryId);
    if (!delivery) {
      throw new NotFoundException("CANNOT DELTE - NOT FOUND");
    }

    return this.deliveriesRepository.delete(deliveryId);
  }
}
