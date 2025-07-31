import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  createUser(email: string, password: string): Promise<User> {
    const data = { email, password };
    return this.prisma.user.create({ data });
  }

  async removeRefreshToken(userId: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
