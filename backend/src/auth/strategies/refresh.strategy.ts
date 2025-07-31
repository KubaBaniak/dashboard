import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/jwt-payload.type";
import { Request } from "express";
import { JwtPayloadWithRefreshToken } from "../types/jwt-payload-refresh-token.type";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = (request.get("authorization") ?? "").replace("Bearer", " ").trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
