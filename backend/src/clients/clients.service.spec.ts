import { Test, TestingModule } from "@nestjs/testing";
import { ClientsService } from "./clients.service";
import { ClientsRepository } from "./clients.repository";
import { mock } from "jest-mock-extended";
import { ConflictException } from "@nestjs/common";
import { Client } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { NotFoundException } from "@nestjs/common";
import { UpdateClientDto } from "./dto/update-client.dto";

describe("ClientsService", () => {
  let service: ClientsService;
  let clientsRepository: jest.Mocked<ClientsRepository>;

  beforeEach(async () => {
    clientsRepository = mock<ClientsRepository>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsService, { provide: ClientsRepository, useValue: clientsRepository }],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createClient", () => {
    it("should create client if email is not taken", async () => {
      const dto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        company: faker.company.name(),
        phone: faker.phone.number(),
      };

      const createdClient: Client = {
        id: faker.number.int(),
        createdAt: new Date(),
        ...dto,
      };

      clientsRepository.findClientByEmail.mockResolvedValue(null);
      clientsRepository.createClient.mockResolvedValue(createdClient);

      const result = await service.createClient(dto);

      expect(result).toEqual(createdClient);
      expect(clientsRepository.findClientByEmail).toHaveBeenCalledWith(dto.email);
      expect(clientsRepository.createClient).toHaveBeenCalledWith(dto);
    });

    it("should throw ConflictException if client with email already exists", async () => {
      const dto = {
        email: faker.internet.email(),
        name: "John",
        phone: "123456789",
        address: "Street 1",
        company: "Company",
      };

      const existingClient = {
        ...dto,
        id: faker.number.int(),
        createdAt: new Date(),
        orders: [],
      } as Client;

      clientsRepository.findClientByEmail.mockResolvedValue(existingClient);

      await expect(service.createClient(dto)).rejects.toThrow(ConflictException);
      expect(clientsRepository.createClient).not.toHaveBeenCalled();
    });
  });

  describe("getAllClients", () => {
    it("should return list of clients", async () => {
      const clients: Client[] = [
        {
          id: 1,
          email: faker.internet.email(),
          name: faker.person.fullName(),
          address: faker.location.streetAddress(),
          company: faker.company.name(),
          phone: faker.phone.number(),
          createdAt: new Date(),
        },
      ];

      clientsRepository.getAllClients.mockResolvedValue(clients);

      const result = await service.getAllClients();

      expect(result).toEqual(clients);
      expect(clientsRepository.getAllClients).toHaveBeenCalled();
    });
  });

  describe("getClientById", () => {
    it("should return client by id", async () => {
      const client: Client = {
        id: 123,
        email: faker.internet.email(),
        name: "Test User",
        phone: "123123123",
        address: "Test Address",
        company: "Test Co",
        createdAt: new Date(),
      };

      clientsRepository.getClientById.mockResolvedValue(client);

      const result = await service.getClientById(client.id);

      expect(result).toEqual(client);
      expect(clientsRepository.getClientById).toHaveBeenCalledWith(client.id);
    });

    it("should return null if client does not exist", async () => {
      clientsRepository.getClientById.mockResolvedValue(null);

      const result = await service.getClientById(999);
      expect(result).toBeNull();
    });
  });

  describe("updateClient", () => {
    it("should update and return client if found", async () => {
      const id = faker.number.int();
      const existingClient: Client = {
        id,
        email: faker.internet.email(),
        name: "Old Name",
        phone: "111111111",
        address: "Old Street",
        company: "Old Co",
        createdAt: new Date(),
      };

      const dto: UpdateClientDto = {
        name: "New Name",
        phone: "222222222",
      };

      const updatedClient: Client = {
        ...existingClient,
        ...dto,
      };

      clientsRepository.getClientById.mockResolvedValue(existingClient);
      clientsRepository.updateClient.mockResolvedValue(updatedClient);

      const result = await service.updateClient(id, dto);

      expect(result).toEqual(updatedClient);
      expect(clientsRepository.getClientById).toHaveBeenCalledWith(id);
      expect(clientsRepository.updateClient).toHaveBeenCalledWith(id, dto);
    });

    it("should throw NotFoundException if client doesn't exist", async () => {
      const id = faker.number.int();
      const dto: UpdateClientDto = { name: "Won't be used" };

      clientsRepository.getClientById.mockResolvedValue(null);

      await expect(service.updateClient(id, dto)).rejects.toThrow(NotFoundException);
      expect(clientsRepository.updateClient).not.toHaveBeenCalled();
    });
  });

  describe("deleteClient", () => {
    it("should delete and return client if found", async () => {
      const id = faker.number.int();
      const client: Client = {
        id,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        company: faker.company.name(),
        createdAt: new Date(),
      };

      clientsRepository.getClientById.mockResolvedValue(client);
      clientsRepository.deleteClient.mockResolvedValue(client);

      const result = await service.deleteClient(id);

      expect(result).toEqual(client);
      expect(clientsRepository.getClientById).toHaveBeenCalledWith(id);
      expect(clientsRepository.deleteClient).toHaveBeenCalledWith(id);
    });

    it("should throw NotFoundException if client does not exist", async () => {
      const id = faker.number.int();

      clientsRepository.getClientById.mockResolvedValue(null);

      await expect(service.deleteClient(id)).rejects.toThrow(NotFoundException);
      expect(clientsRepository.deleteClient).not.toHaveBeenCalled();
    });
  });
});
