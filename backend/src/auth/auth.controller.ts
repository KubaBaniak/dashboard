import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { User } from "@prisma/client";
import { Roles } from "./utils/roles.decorator";
import { RolesGuard } from "./guards/role-guard";
import { JwtAuthGuard } from "./guards/jwt-guard";
import { LocalAuthGuard } from "./guards/local-guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Body() userData: User): { accessToken: string } {
    return this.authService.login({ userId: userData.id, role: userData.role });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  signUp(@Body() signUpData: SignUpDto) {
    return this.authService.signUp(signUpData);
  }

  @UseGuards(JwtAuthGuard)
  @Get("user")
  testuser() {
    return "user";
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("admin")
  testadmin() {
    return "admin";
  }
}
