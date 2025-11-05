import { faker } from "@faker-js/faker";
import { OrderStatus, Prisma, PrismaClient, Role, User } from "@prisma/client";
import * as bcrypt from "bcrypt";

export async function seedDb(): Promise<void> {
  const prisma = new PrismaClient();

  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("Skipping admin seed: ADMIN_EMAIL or ADMIN_PASSWORD is not defined.");
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin: User = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: Role.ADMIN,
      password: hashedPassword,
    },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: Role.ADMIN,
      password: hashedPassword,
    },
  });

  console.log("Admin user seeded:", admin);

  const skipDbSeed = (await prisma.category.count()) > 10;
  if (skipDbSeed || process.env.SEED_WHOLE_APP !== "true") {
    console.log("SEED_WHOLE_APP !== 'true' – skipping.");
    return;
  }

  await prisma.$transaction(
    async tx => {
      const categories = await Promise.all(
        Array.from({ length: 15 }, () =>
          tx.category.create({
            data: { name: faker.commerce.department() },
          }),
        ),
      );
      const categoryIds = categories.map(c => c.id);

      const products = await Promise.all(
        Array.from({ length: 70 }, (_, i) => {
          const count = faker.number.int({ min: 0, max: 3 });
          const chosen = faker.helpers.shuffle(categoryIds).slice(0, count);

          return tx.product.create({
            data: {
              title: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              sku: faker.commerce.isbn(),
              stockQuantity: faker.number.int({ min: 20, max: 300 }),
              price: new Prisma.Decimal(faker.commerce.price({ min: 5, max: 2000, dec: 2 })),
              categories: {
                connect: chosen.map(id => ({ id })),
              },
            },
          });
        }),
      );
      const productLite = products.map(p => ({
        id: p.id,
        price: p.price,
        title: p.title,
        sku: p.sku,
      }));
      const productIds = productLite.map(p => p.id);

      const clients = await Promise.all(
        Array.from({ length: 182 }, () =>
          tx.client.create({
            data: {
              email: faker.internet.email().toLowerCase(),
              name: faker.person.fullName(),
              phone: faker.phone.number(),
              address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}, ${faker.location.country()}`,
              company: faker.company.name(),
            },
          }),
        ),
      );
      const clientIds = clients.map(c => c.id);

      await Promise.all(
        Array.from({ length: 97 }, () => {
          const pid = faker.helpers.arrayElement(productIds);
          return tx.delivery.create({
            data: {
              productId: pid,
              quantity: faker.number.int({ min: 1, max: 99 }),
              note: faker.datatype.boolean() ? faker.lorem.sentence() : null,
            },
          });
        }),
      );

      const STATUSES: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

      for (const buyerId of clientIds) {
        const ordersCount = faker.number.int({ min: 0, max: 8 });
        for (let j = 0; j < ordersCount; j++) {
          const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}, ${faker.location.country()}`;

          const itemsCount = faker.number.int({ min: 1, max: 5 });
          const chosen = faker.helpers.shuffle(productLite).slice(0, itemsCount);
          const items = chosen.map(p => ({
            productId: p.id,
            quantity: faker.number.int({ min: 1, max: 4 }),
            price: p.price,
          }));

          await tx.order.create({
            data: {
              buyerId,
              shippingAddress: address,
              billingAddress: address,
              status: faker.helpers.arrayElement(STATUSES),
              items: {
                create: items.map(it => ({
                  productId: it.productId,
                  quantity: it.quantity,
                  price: it.price,
                })),
              },
            },
          });
        }
      }
    },
    { timeout: 60_000 * 60 },
  );

  console.log("✅ Seed finished.");
  await prisma.$disconnect();
}
