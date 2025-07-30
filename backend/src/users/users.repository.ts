import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createUser(email: string, password: string): Promise<User> {
    const data = { email, password };
    return this.prisma.user.create({ data });
  }
}
