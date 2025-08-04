import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

export async function seedDbDev() {
  const prisma = new PrismaClient();
  const filePath = path.join(__dirname, "seed_data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileContent);

  // 1. Users
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        role: user.role as Role,
        password: user.password,
        refreshToken: user.refreshToken,
      },
    });
  }

  // 2. Clients
  for (const client of data.clients) {
    await prisma.client.create({
      data: {
        email: client.email,
        name: client.name,
        phone: client.phone,
        address: client.address,
        company: client.company,
        createdAt: new Date(client.createdAt),
      },
    });
  }

  // 3. Categories
  for (const category of data.categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
      },
    });
  }

  // 4. Products
  for (const product of data.products) {
    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
        price: product.price,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
        categories: {
          connect: product.categories.map((id: number) => ({ id })),
        },
      },
    });
  }

  // 5. Orders
  for (const order of data.orders) {
    await prisma.order.create({
      data: {
        buyerId: order.buyerId,
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        status: order.status as OrderStatus,
        createdAt: new Date(order.createdAt),
      },
    });
  }

  // 6. Order Items
  for (const item of data.orderItems) {
    await prisma.orderItem.create({
      data: {
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      },
    });
  }

  // 7. Deliveries
  for (const delivery of data.deliveries) {
    await prisma.delivery.create({
      data: {
        productId: delivery.productId,
        quantity: delivery.quantity,
        deliveredAt: new Date(delivery.deliveredAt),
        note: delivery.note,
      },
    });
  }
  await prisma.$disconnect();

  console.log("✅ Database seeded.");
}
