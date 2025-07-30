import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { Role, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { PrismaService } from "../database/prisma.service";
import { BadRequestException } from "@nestjs/common";
import { mock } from "jest-mock-extended";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    usersService = mock<UsersService>();
    jwtService = mock<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        UsersRepository,
        PrismaService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe("validateUser", () => {
    it("correctly validates user when email and password are valid", async () => {
      const password = "securePass123";
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = {
        id: faker.number.int(),
        email: faker.internet.email(),
        name: null,
        password: hashedPassword,
        role: Role.USER,
      };

      jest.spyOn(usersService, "findUserByEmail").mockResolvedValue(user);

      const validatedUser = await authService.validateUser({
        email: user.email,
        password: password,
      });

      expect(validatedUser).toEqual(user);
    });

    it("returns null when user is not found", async () => {
      jest.spyOn(usersService, "findUserByEmail").mockResolvedValue(null);

      const result = await authService.validateUser({
        email: faker.internet.email(),
        password: "irrelevant",
      });

      expect(result).toBeNull();
    });

    it("returns null when password is incorrect", async () => {
      const user = {
        id: faker.number.int(),
        email: faker.internet.email(),
        name: null,
        password: await bcrypt.hash("correctPassword", 12),
        role: Role.USER,
      };

      jest.spyOn(usersService, "findUserByEmail").mockResolvedValue(user);

      const result = await authService.validateUser({
        email: user.email,
        password: "wrongPassword",
      });

      expect(result).toBeNull();
    });
  });

  describe("comparePasswords", () => {
    it("returns true for matching passwords", async () => {
      const plain = "password123";
      const hashed = await bcrypt.hash(plain, 12);

      const result = await authService.comparePasswords(plain, hashed);
      expect(result).toBe(true);
    });

    it("returns false for non-matching passwords", async () => {
      const hashed = await bcrypt.hash("correct", 12);
      const result = await authService.comparePasswords("wrong", hashed);
      expect(result).toBe(false);
    });
  });

  describe("hashPassword", () => {
    it("hashes the password correctly", async () => {
      const plain = "myPassword!";
      const hashed = await authService.hashPassword(plain);

      const matches = await bcrypt.compare(plain, hashed);
      expect(matches).toBe(true);
    });
  });

  describe("login", () => {
    it("returns a valid access token", () => {
      const token = "mocked.token.value";
      const payload = { userId: faker.number.int(), role: "admin" };

      jest.spyOn(jwtService, "sign").mockReturnValue(token);

      const result = authService.login(payload);

      expect(result).toEqual({ accessToken: token });
    });
  });

  describe("signUp", () => {
    it("throws BadRequestException if user already exists", async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      jest.spyOn(usersService, "findUserByEmail").mockResolvedValue({ email } as User);

      await expect(authService.signUp({ email, password })).rejects.toThrow(BadRequestException);
    });

    it("creates user if email is not taken", async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const user = { id: faker.number.int(), email } as User;

      jest.spyOn(usersService, "findUserByEmail").mockResolvedValue(null);
      jest.spyOn(usersService, "createUser").mockResolvedValue(user);

      const result = await authService.signUp({ email, password });

      expect(result).toEqual(user);
    });
  });
});
