import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { ClientsService } from "./clients.service";
import { Client } from "@prisma/client";
import { UpdateClientDto } from "./dto/update-client.dto";
import { GetClientsQueryDto } from "./dto/get-clients.query.dto";
import { PagedResponse } from "src/common/dto/paged-response.dto";
import { ClientRowDto } from "./dto/client-row.dto";
import { ClientOverviewDto } from "./dto/client-overview.dto";
import { GetClientIdsQueryDto } from "./dto/get-client-ids.query.dto";
import { BulkDeleteClientsDto } from "./dto/bulk-delete-clients.dto";
import { ExportClientsQueryDto } from "./dto/export-clients.query.dto";
import { Response } from "express";
import { GetClientsOptions } from "./dto/get-client-options.dto";
import { ClientLatestDto } from "./dto/client-latest.dto";
import { ClientTopDto } from "./dto/client-top.dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  createClient(@Body() payload: CreateClientDto): Promise<Client> {
    return this.clientsService.createClient(payload);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllClients(@Query() query: GetClientsQueryDto): Promise<PagedResponse<ClientRowDto>> {
    return this.clientsService.getBaseClientsDetails(query);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("options")
  getClientsOptions(): Promise<GetClientsOptions[]> {
    return this.clientsService.getOptions();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("ids")
  getClientsByIds(@Query() query: GetClientIdsQueryDto): Promise<{ ids: number[]; total: number }> {
    return this.clientsService.getIds(query);
  }

  @Get("latest")
  @HttpCode(HttpStatus.OK)
  getLatest(@Query() q: { limit?: number }): Promise<ClientLatestDto[]> {
    const limit = Math.min(24, Math.max(1, Number(q.limit ?? 6)));
    return this.clientsService.getLatestClients(limit);
  }

  @Get("top")
  @HttpCode(HttpStatus.OK)
  getTop(@Query() q: { limit?: number }): Promise<ClientTopDto[]> {
    const limit = Math.min(24, Math.max(1, Number(q.limit ?? 6)));
    return this.clientsService.getTopClients(limit);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getClientById(@Param("id") clientId: string): Promise<Client | null> {
    return this.clientsService.getClientById(+clientId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:id/overview")
  getClientOverview(@Param("id") clientId: string): Promise<ClientOverviewDto> {
    return this.clientsService.getClientOverview(+clientId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch("/:id")
  updateClient(@Param("id") clientId: string, @Body() clientData: UpdateClientDto): Promise<Client | null> {
    return this.clientsService.updateClient(+clientId, clientData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  deleteClient(@Param("id") clientId: string): Promise<Client> {
    return this.clientsService.deleteClient(+clientId);
  }

  @Post("bulk-delete")
  @HttpCode(HttpStatus.OK)
  bulkDelete(@Body() dto: BulkDeleteClientsDto): Promise<{
    deleted: number;
    failed: { id: number; reason: string }[];
  }> {
    return this.clientsService.bulkDelete(dto);
  }

  @Get("export/csv")
  @HttpCode(HttpStatus.OK)
  @Header("Content-Type", "text/csv; charset=utf-8")
  exportCsv(@Query() query: ExportClientsQueryDto, @Res({ passthrough: true }) res: Response): StreamableFile {
    const filename = `clients_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    const stream = this.clientsService.exportClientsCsvStream(query);
    return new StreamableFile(stream);
  }
}
