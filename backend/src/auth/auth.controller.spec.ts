import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Role, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { SignUpDto } from "./dto/sign-up.dto";
import { mock } from "jest-mock-extended";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authService = mock<AuthService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("login", () => {
    it("should return accessToken from AuthService", () => {
      const user: User = {
        id: faker.number.int(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password(),
        role: Role.ADMIN,
      };

      const token = { accessToken: "mocked.jwt.token" };
      authService.login.mockReturnValue(token);

      const result = controller.login(user);

      expect(result).toEqual(token);
    });
  });

  describe("signUp", () => {
    it("should call AuthService.signUp and return created user", async () => {
      const dto: SignUpDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user: User = {
        id: faker.number.int(),
        email: dto.email,
        password: "hashed",
        name: null,
        role: Role.USER,
      };

      authService.signUp.mockResolvedValue(user);

      const result = await controller.signUp(dto);

      expect(result).toEqual(user);
    });
  });
});
