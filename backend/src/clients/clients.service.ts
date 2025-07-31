import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientsRepository } from "./clients.repository";
import { CreateClientDto } from "./dto/create-client.dto";
import { Client } from "@prisma/client";
import { UpdateClientDto } from "./dto/update-client.dto";

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

  async updateClient(clientId: number, data: UpdateClientDto): Promise<Client> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException("CANNOT UPDATE CLIENT - no client with such ID");
    }

    return this.clientsRepository.updateClient(clientId, data);
  }

  async deleteClient(clientId: number): Promise<Client> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new NotFoundException("CANNOT DELETE CLIENT - no client with such ID");
    }

    return this.clientsRepository.deleteClient(clientId);
  }
}
