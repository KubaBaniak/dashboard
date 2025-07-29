import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}

  findUserByEmail(email: string): Promise<User | null> {
    return this.repository.getUserByEmail(email);
  }

  createUser(email: string, password: string): Promise<User> {
    return this.repository.createUser(email, password);
  }
}
