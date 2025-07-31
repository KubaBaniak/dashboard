import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../utils/roles.decorator";
import { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // eslint-disable-next-line
    const jwtPayload: JwtPayload = context.switchToHttp().getRequest().user;
    if (!jwtPayload || !requiredRoles.includes(jwtPayload.role)) {
      throw new ForbiddenException("You do not have permission (role mismatch)");
    }

    return true;
  }
}
