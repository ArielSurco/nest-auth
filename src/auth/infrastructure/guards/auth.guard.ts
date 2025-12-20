import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.sessionService.extractTokenFromRequest(request);

    const isValidToken = await this.sessionService.isValidToken(token ?? '');

    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    request.user = await this.sessionService.getPayload(token);

    return true;
  }
}
