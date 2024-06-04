import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user.service';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Determines if the request can proceed based on the presence and validity of a JWT token.
   * @param context - The execution context of the request.
   * @returns A boolean indicating if the request can proceed.
   * @throws UnauthorizedException if no token is provided or if the token is invalid or expired.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = await this.validateToken(token);
    const user = await this.validateUser(payload);

    request['auser'] = user;
    return true;
  }

  /**
   * Extracts the JWT token from the Authorization header.
   * @param request - The incoming HTTP request.
   * @returns The JWT token if present, otherwise undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * Validates the JWT token.
   * @param token - The JWT token to validate.
   * @returns The decoded JWT payload.
   * @throws UnauthorizedException if the token is invalid or expired.
   */
  private async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SEED,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Validates the user based on the JWT payload.
   * @param payload - The decoded JWT payload.
   * @returns The validated user.
   * @throws UnauthorizedException if the user does not exist or is not active.
   */
  private async validateUser(payload: JwtPayload) {
    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }
}
