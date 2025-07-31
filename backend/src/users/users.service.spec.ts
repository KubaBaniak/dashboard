import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { mock } from "jest-mock-extended";
import { faker } from "@faker-js/faker/.";
import { Role, User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

describe("UsersService", () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    usersRepository = mock<UsersRepository>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepository, useValue: usersRepository }, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe("findUserByEmail", () => {
    it("should find user by email", async () => {
      const email = faker.internet.email();
      const user: User = {
        id: faker.number.int(),
        name: null,
        email,
        password: faker.internet.password(),
        role: Role.USER,
        refreshToken: faker.string.alphanumeric({ length: 32 }),
      };
      usersRepository.getUserByEmail.mockResolvedValue(user);

      const foundUser = await usersService.findUserByEmail(email);

      expect(foundUser).toBe(user);
    });
  });

  describe("createUser", () => {
    it("should create user", async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const user: User = {
        id: faker.number.int(),
        name: null,
        email,
        password,
        role: Role.USER,
        refreshToken: faker.string.alphanumeric({ length: 32 }),
      };
      usersRepository.createUser.mockResolvedValue(user);

      const createdUser = await usersService.createUser(email, password);

      expect(createdUser).toBe(user);
    });
  });
});
