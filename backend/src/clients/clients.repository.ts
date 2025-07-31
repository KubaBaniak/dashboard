import { Injectable } from "@nestjs/common";
import { Client, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";

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

  getAllClients(): Promise<Client[] | null> {
    return this.prismaService.client.findMany();
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
