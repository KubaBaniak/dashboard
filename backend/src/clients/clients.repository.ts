import { Injectable } from "@nestjs/common";
import { Client, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { ClientBasic, ClientExportRow, FindPagedBaseClients } from "./types/types";
import { PagedArgs } from "src/common/dto/paged-args.dto";
import { GetClientsOptions } from "./dto/get-client-options.dto";

@Injectable()
export class ClientsRepository {
  constructor(private prismaService: PrismaService) {}

  createClient(data: CreateClientDto): Promise<Client> {
    const { email, name, phone, address, company } = data;
    return this.prismaService.client.create({
      data: {
        email,
        name,
        phone,
        address,
        company,
        orders: undefined,
      },
    });
  }

  findOptions(): Promise<GetClientsOptions[]> {
    return this.prismaService.client.findMany({
      select: { id: true, email: true, name: true },
      orderBy: { email: "asc" },
    });
  }

  findClientByEmail(email: string): Promise<Client | null> {
    return this.prismaService.client.findUnique({ where: { email } });
  }

  async findBaseClientsPaged({ skip, take, q }: PagedArgs): Promise<FindPagedBaseClients> {
    const where: Prisma.ClientWhereInput | undefined = q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;
    const [total, rows] = await this.prismaService.$transaction([
      this.prismaService.client.count({ where }),
      this.prismaService.client.findMany({
        where,
        skip,
        take,
        orderBy: { id: "desc" },
      }),
    ]);

    return { rows, total };
  }

  getClientById(id: number): Promise<Client | null> {
    return this.prismaService.client.findUnique({ where: { id } });
  }

  async findIds(where: Prisma.ClientWhereInput | undefined, take: number): Promise<{ ids: number[]; total: number }> {
    const [total, rows] = await this.prismaService.$transaction([
      this.prismaService.client.count({ where }),
      this.prismaService.client.findMany({
        where,
        select: { id: true },
        orderBy: { id: "asc" },
        take,
      }),
    ]);

    return { total, ids: rows.map(r => r.id) };
  }

  updateClient(clientId: number, data: Prisma.ClientUpdateInput): Promise<Client> {
    return this.prismaService.client.update({ where: { id: clientId }, data });
  }

  deleteClient(clientId: number): Promise<Client> {
    return this.prismaService.client.delete({ where: { id: clientId } });
  }

  deleteManyWhereNoOrders(ids: number[]) {
    return this.prismaService.client.deleteMany({
      where: {
        id: { in: ids },
        orders: { none: {} },
      },
    });
  }

  async findIdsWithOrders(ids: number[]): Promise<number[]> {
    if (!ids.length) return [];
    const rows = await this.prismaService.client.findMany({
      where: { id: { in: ids }, orders: { some: {} } },
      select: { id: true },
    });
    return rows.map(r => r.id);
  }

  async findExistingIds(ids: number[]): Promise<number[]> {
    if (!ids.length) return [];
    const rows = await this.prismaService.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    return rows.map(r => r.id);
  }

  async findPageForExport(
    where: Prisma.ClientWhereInput | undefined,
    take: number,
    cursorId?: number,
  ): Promise<ClientExportRow[]> {
    return this.prismaService.client.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        company: true,
        createdAt: true,
      },
      take,
      ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
      orderBy: { id: "asc" },
    });
  }

  findLatest(take: number) {
    return this.prismaService.client.findMany({
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  findClientsByIds(ids: number[]): Promise<ClientBasic[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prismaService.client.findMany({
      where: { id: { in: ids } },
      select: { id: true, email: true, name: true },
    });
  }
}
