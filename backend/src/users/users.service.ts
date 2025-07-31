import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  findUserByEmail(email: string): Promise<User | null> {
    return this.repository.getUserByEmail(email);
  }

  findUserById(userId: number): Promise<User | null> {
    return this.repository.getUserById(userId);
  }

  createUser(email: string, password: string): Promise<User> {
    return this.repository.createUser(email, password);
  }

  updateRefreshToken(userId: number, token: string | null): Promise<User> {
    return this.repository.updateRefreshToken(userId, token);
  }

  removeRefreshToken(userId: number): Promise<User> {
    return this.repository.removeRefreshToken(userId);
  }
}
