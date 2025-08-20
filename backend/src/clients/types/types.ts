import { Prisma } from "@prisma/client";

export type BaseClient = Prisma.ClientGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    phone: true;
    address: true;
    company: true;
    createdAt: true;
  };
}>;

export type FindPagedBaseClients = { rows: BaseClient[]; total: number };
