import { Injectable } from "@nestjs/common";
import { Client } from "@prisma/client";
import { PrismaService } from "src/database/prisma.service";
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
}
