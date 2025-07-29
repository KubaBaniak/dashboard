import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaModule } from "src/database/prisma.module";
import { UsersRepository } from "./users.repository";

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
