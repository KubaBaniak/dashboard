import { Injectable } from "@nestjs/common";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { Delivery, Prisma } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";

@Injectable()
export class DeliveriesRepository {
  constructor(private prisma: PrismaService) {}

  create(updatedQty: number, data: CreateDeliveryDto): Promise<Delivery> {
    return this.prisma.$transaction(async tx => {
      await tx.product.update({
        where: { id: data.productId },
        data: { stockQuantity: updatedQty },
      });

      return tx.delivery.create({
        data: {
          productId: data.productId,
          quantity: data.quantity,
          note: data.note,
        },
      });
    });
  }

  getById(id: number): Promise<Delivery | null> {
    return this.prisma.delivery.findUnique({ where: { id } });
  }

  getAll(): Promise<Delivery[]> {
    return this.prisma.delivery.findMany();
  }

  update(id: number, data: UpdateDeliveryDto): Promise<Delivery> {
    return this.prisma.delivery.update({
      where: { id },
      data: {
        product: { connect: { id: data.productId } },
        note: data.note,
        quantity: data.quantity,
      },
    });
  }

  updateInTx(tx: Prisma.TransactionClient, deliveryId: number, data: UpdateDeliveryDto): Promise<Delivery> {
    return tx.delivery.update({
      where: { id: deliveryId },
      data: {
        note: data.note,
        quantity: data.quantity,
        product: data.productId ? { connect: { id: data.productId } } : undefined,
      },
    });
  }

  delete(id: number): Promise<Delivery> {
    return this.prisma.delivery.delete({
      where: { id },
    });
  }
}
