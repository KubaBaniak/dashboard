import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { ClientsService } from "./clients.service";
import { Client } from "@prisma/client";
import { UpdateClientDto } from "./dto/update-client.dto";

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
  getAllClients(): Promise<Client[] | null> {
    return this.clientsService.getAllClients();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  getClientById(@Param("id") clientId: string): Promise<Client | null> {
    return this.clientsService.getClientById(+clientId);
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
  deleteClient(@Param("id") clientId): Promise<Client> {
    return this.clientsService.deleteClient(+clientId);
  }
}
