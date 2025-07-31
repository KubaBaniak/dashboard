import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-guard";
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
}
