import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ValidateUserDto } from "./dto/validate-user.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  login(payload: { userId: number; role: string }): { accessToken: string } {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signUp({ email, password }: SignUpDto): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (user) {
      throw new BadRequestException();
    }

    const hashedPassword = await this.hashPassword(password);
    return this.usersService.createUser(email, hashedPassword);
  }
}
