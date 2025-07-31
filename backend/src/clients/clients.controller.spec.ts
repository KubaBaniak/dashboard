import { Test, TestingModule } from "@nestjs/testing";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { mock } from "jest-mock-extended";
import { Client } from "@prisma/client";
import { faker } from "@faker-js/faker";

describe("ClientsController", () => {
  let controller: ClientsController;
  let clientsService: ReturnType<typeof mock<ClientsService>>;

  beforeEach(async () => {
    clientsService = mock<ClientsService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [{ provide: ClientsService, useValue: clientsService }],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createClient", () => {
    it("should call service and return created client", async () => {
      const dto: CreateClientDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        company: faker.company.name(),
      };

      const createdClient: Client = {
        id: faker.number.int(),
        createdAt: new Date(),
        ...dto,
      };

      clientsService.createClient.mockResolvedValue(createdClient);

      const result = await controller.createClient(dto);

      expect(result).toEqual(createdClient);
      expect(clientsService.createClient).toHaveBeenCalledWith(dto);
    });
  });

  describe("getAllClients", () => {
    it("should return list of all clients", async () => {
      const clients: Client[] = [
        {
          id: 1,
          email: faker.internet.email(),
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          company: faker.company.name(),
          createdAt: new Date(),
        },
      ];

      clientsService.getAllClients.mockResolvedValue(clients);

      const result = await controller.getAllClients();

      expect(result).toEqual(clients);
      expect(clientsService.getAllClients).toHaveBeenCalled();
    });
  });

  describe("getClientById", () => {
    it("should return client by id", async () => {
      const id = 123;
      const client: Client = {
        id,
        email: faker.internet.email(),
        name: "Client Name",
        phone: faker.phone.number(),
        address: "Test Address",
        company: "Test Co",
        createdAt: new Date(),
      };

      clientsService.getClientById.mockResolvedValue(client);

      const result = await controller.getClientById(id.toString());

      expect(result).toEqual(client);
      expect(clientsService.getClientById).toHaveBeenCalledWith(id);
    });

    it("should return null if client not found", async () => {
      const id = 999;

      clientsService.getClientById.mockResolvedValue(null);

      const result = await controller.getClientById(id.toString());

      expect(result).toBeNull();
    });
  });
});
