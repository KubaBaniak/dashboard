import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";

export const Currentuser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const { jwtPayload }: { jwtPayload: JwtPayload } = ctx.switchToHttp().getRequest();
  return jwtPayload;
});
