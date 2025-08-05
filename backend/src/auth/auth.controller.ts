import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { Role, User } from "@prisma/client";
import { Roles } from "./utils/roles.decorator";
import { RolesGuard } from "./guards/role-guard";
import { JwtAuthGuard } from "./guards/jwt-guard";
import { LocalAuthGuard } from "./guards/local-guard";
import { CurrentUser } from "./utils/current-user.decorator";
import { JwtPayload } from "./types/jwt-payload.type";
import { RefreshGuard } from "./guards/refresh-guard";
import { JwtPayloadWithRefreshToken } from "./types/jwt-payload-refresh-token.type";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @Body() userData: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ email: string }> {
    const tokens = await this.authService.login(userData.email);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { email: userData.email };
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
  @Get("me")
  getMe(@Req() req: Request & { user: JwtPayload }): { id: number; role: string } {
    const { sub, role } = req.user;
    return { id: sub, role };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  logout(@CurrentUser() userData: JwtPayload, @Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return this.authService.logout(userData.sub);
  }
}
