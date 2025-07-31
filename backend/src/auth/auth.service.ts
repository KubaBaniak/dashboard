import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ValidateUserDto } from "./dto/validate-user.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { User } from "@prisma/client";
import { Tokens } from "./types/tokens.type";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser({ email, password }: ValidateUserDto): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(email: string): Promise<Tokens> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new ForbiddenException();
    const tokens = await this.signTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async signUp({ email, password }: SignUpDto): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      throw new BadRequestException();
    }

    const hashedPassword = await this.hashPassword(password);
    return this.usersService.createUser(email, hashedPassword);
  }

  private async signTokens(userId: number, role: string): Promise<Tokens> {
    const refreshToken = await this.jwtService.signAsync({ sub: userId, role }, {
      expiresIn: this.configService.get<string>("REFRESH_LIFESPAN"),
      secret: this.configService.get<string>("JWT_SECRET"),
    } as JwtSignOptions);

    const accessToken = await this.jwtService.signAsync({ sub: userId, role }, {
      expiresIn: this.configService.get("ACCESS_LIFESPAN"),
      secret: this.configService.get<string>("JWT_SECRET"),
    } as JwtSignOptions);

    return { refreshToken, accessToken };
  }

  async refresh(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findUserById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access denied");
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!tokenMatches) {
      throw new ForbiddenException("Access denied");
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.removeRefreshToken(userId);
  }

  private async removeRefreshToken(userId: number): Promise<void> {
    await this.usersService.removeRefreshToken(userId);
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshedToken = await bcrypt.hash(refreshToken, 12);

    await this.usersService.updateRefreshToken(userId, hashedRefreshedToken);
  }

  comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }
}
