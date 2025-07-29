import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private repository: UsersRepository) {}
  findUserByName(name: string) {
    return { id: 5, name, password: "test" };
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.repository.getUserByEmail(email);
  }
}
