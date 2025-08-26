import { Prisma, PrismaClient } from "@prisma/client";
export type TxClient = Prisma.TransactionClient;
export type DbClient = PrismaClient | TxClient;
