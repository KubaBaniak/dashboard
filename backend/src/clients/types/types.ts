import { Client, Prisma } from "@prisma/client";

export type ClientExportRow = Pick<Client, "id" | "email" | "name" | "phone" | "address" | "company" | "createdAt">;

export type ClientBasic = { id: number; email: string; name?: string | null };

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
