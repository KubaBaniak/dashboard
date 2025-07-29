import { PrismaClient, Role, User } from "@prisma/client";
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

  await prisma.$disconnect();

  console.log("Admin user seeded:", admin);
}
