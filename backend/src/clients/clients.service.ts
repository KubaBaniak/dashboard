import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientsRepository } from "./clients.repository";
import { CreateClientDto } from "./dto/create-client.dto";
import { Client } from "@prisma/client";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientRowDto } from "./dto/client-row.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { GetClientsQueryDto } from "./dto/get-clients.query.dto";
import { ClientOverviewDto } from "./dto/client-overview.dto";
import { OrdersService } from "src/orders/orders.service";

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {}

  async createClient(data: CreateClientDto): Promise<Client> {
    const client = await this.clientsRepository.findClientByEmail(data.email);

    if (client) {
      throw new ConflictException("Client with such email already exists");
    }

    return this.clientsRepository.createClient(data);
  }

  async getBaseClientsDetails(query: GetClientsQueryDto): Promise<PagedResponse<ClientRowDto>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 10));
    const skip = (page - 1) * pageSize;
    const q = (query.q ?? "").trim();

    const { rows, total } = await this.clientsRepository.findBaseClientsPaged({
      skip,
      take: pageSize,
      q: q || undefined,
    });

    const data: ClientRowDto[] = rows.map(r => ({
      id: r.id,
      email: r.email,
      name: r.email,
      phone: r.phone,
      address: r.address,
      company: r.company,
      createdAt: String(r.createdAt),
    }));

    return { data, page, pageSize, total };
  }

  getClientById(id: number): Promise<Client | null> {
    return this.clientsRepository.getClientById(id);
  }

  async getClientOverview(clientId: number): Promise<ClientOverviewDto> {
    return this.ordersService.getBuyerOverview(clientId);
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
