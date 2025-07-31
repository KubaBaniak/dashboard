import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { Role, User } from "@prisma/client";
import { Roles } from "./utils/roles.decorator";
import { RolesGuard } from "./guards/role-guard";
import { JwtAuthGuard } from "./guards/jwt-guard";
import { LocalAuthGuard } from "./guards/local-guard";
import { Tokens } from "./types/tokens.type";
import { CurrentUser } from "./utils/current-user.decorator";
import { JwtPayload } from "./types/jwt-payload.type";
import { RefreshGuard } from "./guards/refresh-guard";
import { JwtPayloadWithRefreshToken } from "./types/jwt-payload-refresh-token.type";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Body() userData: { email: string; password: string }): Promise<Tokens> {
    return this.authService.login(userData.email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @Post("signup")
  async signUp(@Body() signUpData: SignUpDto): Promise<User | null> {
    return this.authService.signUp(signUpData);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  @Post("refresh")
  refresh(@Req() req: Request) {
    const reqWithUser = req as Request & { user: JwtPayloadWithRefreshToken };
    const payload: JwtPayloadWithRefreshToken = reqWithUser.user;

    return this.authService.refresh(payload.sub, payload.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@CurrentUser() userData: JwtPayload): Promise<void> {
    return this.authService.logout(userData.sub);
  }
}
