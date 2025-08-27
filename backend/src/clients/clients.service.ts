import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClientsRepository } from "./clients.repository";
import { CreateClientDto } from "./dto/create-client.dto";
import { Client, Prisma } from "@prisma/client";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientRowDto } from "./dto/client-row.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { GetClientsQueryDto } from "./dto/get-clients.query.dto";
import { ClientOverviewDto } from "./dto/client-overview.dto";
import { OrdersService } from "src/orders/orders.service";
import { GetClientIdsQueryDto } from "./dto/get-client-ids.query.dto";
import { BulkDeleteClientsDto } from "./dto/bulk-delete-clients.dto";
import { ExportClientsQueryDto } from "./dto/export-clients.query.dto";
import { Readable } from "stream";

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepository: ClientsRepository,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {}

  private buildWhere(q?: string): Prisma.ClientWhereInput | undefined {
    const term = q?.trim();
    if (!term) return undefined;
    return {
      OR: [
        { email: { contains: term, mode: "insensitive" } },
        { name: { contains: term, mode: "insensitive" } },
        { phone: { contains: term, mode: "insensitive" } },
        { address: { contains: term, mode: "insensitive" } },
        { company: { contains: term, mode: "insensitive" } },
      ],
    };
  }

  private csvEscape(v: unknown): string {
    let s = String(v);
    if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

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
  async getIds(query: GetClientIdsQueryDto): Promise<{ ids: number[]; total: number }> {
    const where = this.buildWhere(query.q);

    const limit = query.limit ?? 10_000;
    const { ids, total } = await this.clientsRepository.findIds(where, limit);
    return { ids, total };
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

  async bulkDelete(dto: BulkDeleteClientsDto): Promise<{
    deleted: number;
    failed: { id: number; reason: "not_found" | "has_orders" }[];
  }> {
    const ids = Array.from(new Set(dto.ids));
    if (ids.length === 0) return { deleted: 0, failed: [] };

    const [existingIds, idsWithOrders] = await Promise.all([
      this.clientsRepository.findExistingIds(ids),
      this.clientsRepository.findIdsWithOrders(ids),
    ]);

    const existingSet = new Set(existingIds);
    const withOrdersSet = new Set(idsWithOrders);

    const deletableIds = existingIds.filter(id => !withOrdersSet.has(id));

    const { count } = await this.clientsRepository.deleteManyWhereNoOrders(deletableIds);

    const failed: { id: number; reason: "not_found" | "has_orders" }[] = [];
    for (const id of ids) {
      if (!existingSet.has(id)) failed.push({ id, reason: "not_found" });
      else if (withOrdersSet.has(id)) failed.push({ id, reason: "has_orders" });
    }

    return { deleted: count, failed };
  }

  private async *csvRows(
    where: Prisma.ClientWhereInput | undefined,
    hardLimit: number,
    pageSize: number,
  ): AsyncGenerator<string> {
    const header = ["ID", "Email", "Name", "Phone", "Address", "Company", "CreatedAt"];

    yield "\uFEFF";
    yield header.join(",") + "\n";

    let fetched = 0;
    let cursorId: number | undefined;

    while (fetched < hardLimit) {
      const take = Math.min(pageSize, hardLimit - fetched);
      const batch = await this.clientsRepository.findPageForExport(where, take, cursorId);
      if (!batch.length) break;

      for (const c of batch) {
        yield [
          this.csvEscape(c.id),
          this.csvEscape(c.email),
          this.csvEscape(c.name ?? ""),
          this.csvEscape(c.phone ?? ""),
          this.csvEscape(c.address ?? ""),
          this.csvEscape(c.company ?? ""),
          this.csvEscape(c.createdAt.toISOString()),
        ].join(",") + "\n";
      }

      fetched += batch.length;
      cursorId = batch[batch.length - 1].id;
    }
  }

  exportClientsCsvStream(query: ExportClientsQueryDto): Readable {
    const where = this.buildWhere(query.q);
    const hardLimit = query.limit ?? 100_000;
    const pageSize = 1000;
    return Readable.from(this.csvRows(where, hardLimit, pageSize));
  }
}
