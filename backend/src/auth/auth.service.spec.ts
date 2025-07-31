import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { Role, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { PrismaService } from "../database/prisma.service";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { mock } from "jest-mock-extended";
import { ConfigService } from "@nestjs/config";

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
        ConfigService,
        PrismaService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe("validateUser", () => {
    it("correctly validates user when email and password are valid", async () => {
      const password = "securePass123";
      const hashedPassword = await bcrypt.hash(password, 12);

      const user: User = {
        id: faker.number.int(),
        email: faker.internet.email(),
        name: null,
        password: hashedPassword,
        role: Role.USER,
        refreshToken: null,
      };

      usersService.findUserByEmail.mockResolvedValue(user);

      const validatedUser = await authService.validateUser({
        email: user.email,
        password: password,
      });

      expect(validatedUser).toEqual(user);
    });

    it("returns null when user is not found", async () => {
      usersService.findUserByEmail.mockResolvedValue(null);

      const result = await authService.validateUser({
        email: faker.internet.email(),
        password: "irrelevant",
      });

      expect(result).toBeNull();
    });

    it("returns null when password is incorrect", async () => {
      const user: User = {
        id: faker.number.int(),
        email: faker.internet.email(),
        name: null,
        password: await bcrypt.hash("correctPassword", 12),
        role: Role.USER,
        refreshToken: null,
      };

      usersService.findUserByEmail.mockResolvedValue(user);

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
    it("returns tokens and updates refresh token if user exists", async function (this: void) {
      const userId = faker.number.int();
      const email = faker.internet.email();
      const role = Role.USER;

      const user = { id: userId, name: null, email, password: "hashed", role, refreshToken: null } as User;

      const tokens = {
        accessToken: "access.token",
        refreshToken: "refresh.token",
      };

      usersService.findUserByEmail.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValueOnce(tokens.refreshToken).mockResolvedValueOnce(tokens.accessToken);
      usersService.updateRefreshToken.mockResolvedValue(user);

      const result = await authService.login(email);

      expect(result).toEqual(tokens);
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(userId, expect.any(String));
    });

    it("throws ForbiddenException if user does not exist", async () => {
      usersService.findUserByEmail.mockResolvedValue(null);

      const result = authService.login("invalid@example.com");

      await expect(result).rejects.toThrow(ForbiddenException);
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

  describe("refresh", () => {
    it("refreshes tokens if valid refresh token is provided", async () => {
      const userId = faker.number.int();
      const email = faker.internet.email();
      const password = faker.internet.password();
      const hashedRefresh = await bcrypt.hash("valid.refresh.token", 12);

      const user: User = {
        id: userId,
        email,
        password,
        name: null,
        role: Role.USER,
        refreshToken: hashedRefresh,
      };

      const newTokens = {
        accessToken: "new.access.token",
        refreshToken: "new.refresh.token",
      };

      usersService.findUserById.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValueOnce(newTokens.refreshToken).mockResolvedValueOnce(newTokens.accessToken);
      usersService.updateRefreshToken.mockResolvedValue(user);

      const result = await authService.refresh(userId, "valid.refresh.token");

      expect(result).toEqual(newTokens);
      expect(usersService.updateRefreshToken).toHaveBeenCalled();
    });

    it("throws ForbiddenException if user not found", async () => {
      usersService.findUserById.mockResolvedValue(null);

      await expect(authService.refresh(123, "token")).rejects.toThrow("Access denied");
    });

    it("throws ForbiddenException if refresh token does not match", async () => {
      const user: User = {
        id: 1,
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: null,
        role: Role.USER,
        refreshToken: await bcrypt.hash("some.other.token", 12),
      };

      usersService.findUserById.mockResolvedValue(user);

      await expect(authService.refresh(1, "invalid.token")).rejects.toThrow("Access denied");
    });
  });

  describe("logout", () => {
    it("removes the refresh token", async () => {
      const user: User = {
        id: 1,
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: null,
        role: Role.USER,
        refreshToken: null,
      };
      usersService.removeRefreshToken.mockResolvedValue(user);
      await authService.logout(1);
      expect(usersService.removeRefreshToken).toHaveBeenCalledWith(1);
    });
  });
});
