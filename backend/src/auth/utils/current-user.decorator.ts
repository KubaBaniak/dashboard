import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";
import { Request } from "express";

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const req: Request = ctx.switchToHttp().getRequest();
  const reqWithUser = req as Request & { user: JwtPayload };
  const payload: JwtPayload = reqWithUser.user;
  return payload;
});
