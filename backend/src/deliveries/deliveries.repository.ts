import { Injectable } from "@nestjs/common";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { Delivery, Prisma } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";
import { FindPagedDeliveries } from "./types/types";
import { PagedArgs } from "src/common/dto/paged-args.dto";

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

  async getAllPaged({ skip, take, q }: PagedArgs): Promise<FindPagedDeliveries> {
    const where: Prisma.DeliveryWhereInput | undefined = q
      ? {
          OR: [
            { product: { title: { contains: q, mode: "insensitive" } } },
            { note: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.delivery.count({ where }),
      this.prisma.delivery.findMany({
        where,
        skip,
        take,
        orderBy: { deliveredAt: "desc" },
        include: { product: { select: { title: true } } },
      }),
    ]);

    return { rows, total };
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
