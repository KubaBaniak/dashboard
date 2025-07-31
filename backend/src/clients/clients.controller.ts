import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { ClientsService } from "./clients.service";
import { Client } from "@prisma/client";

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
}
