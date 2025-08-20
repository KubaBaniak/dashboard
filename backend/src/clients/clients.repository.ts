import { Injectable } from "@nestjs/common";
import { Client, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { FindPagedBaseClients } from "./types/types";
import { PagedArgs } from "src/common/dto/paged-args.dto";

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

  updateClient(clientId: number, data: Prisma.ClientUpdateInput): Promise<Client> {
    return this.prismaService.client.update({ where: { id: clientId }, data });
  }

  deleteClient(clientId: number): Promise<Client> {
    return this.prismaService.client.delete({ where: { id: clientId } });
  }
}
