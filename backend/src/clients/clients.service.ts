import { ConflictException, Injectable } from "@nestjs/common";
import { ClientsRepository } from "./clients.repository";
import { CreateClientDto } from "./dto/create-client.dto";
import { Client } from "@prisma/client";

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async createClient(data: CreateClientDto): Promise<Client> {
    const client = await this.clientsRepository.findClientByEmail(data.email);

    if (client) {
      throw new ConflictException("Client with such email already exists");
    }

    return this.clientsRepository.createClient(data);
  }

  getAllClients(): Promise<Client[] | null> {
    return this.clientsRepository.getAllClients();
  }

  getClientById(id: number): Promise<Client | null> {
    return this.clientsRepository.getClientById(id);
  }
}
