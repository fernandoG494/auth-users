import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnUser implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request['user']; // Usuario autenticado
    const userId = request.params.id; // ID del usuario en la ruta

    if (user && user._id === userId) {
      return true;
    }

    throw new UnauthorizedException('You can only update your own account');
  }
}
