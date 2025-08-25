import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class APIKeyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const api_key = request.headers['x-api-key'];

      if (!api_key) {
        console.log('api key missing');
        throw new UnauthorizedException();
      }

      if (api_key !== process.env.API_KEY) {
        console.log('api key validation failed');
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return Promise.resolve(true);
  }
}
