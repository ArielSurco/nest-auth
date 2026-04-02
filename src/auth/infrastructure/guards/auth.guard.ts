import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PermissionAttributes } from 'src/permissions/domain/Permission';
import { UserAccountRepository } from 'src/users/domain/UserAccountRepository';
import { Permissions } from '../decorators/permission.decorator';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userAccountRepository: UserAccountRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.sessionService.extractTokenFromRequest(request);
    const isValidToken = await this.sessionService.isValidToken(token ?? '');

    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.sessionService.getPayload(token);
    const permissionsToValidate = this.reflector.get<
      PermissionAttributes['code'][]
    >(Permissions, context.getHandler());

    const hasPermissions = await this.hasPermissions(
      payload?.userId ?? '',
      permissionsToValidate,
    );

    if (permissionsToValidate?.length && !hasPermissions) {
      throw new ForbiddenException();
    }

    request.user = payload;

    return true;
  }

  private async hasPermissions(
    userId: string,
    permissionsToValidate: PermissionAttributes['code'][] = [],
  ): Promise<boolean> {
    const userAccount = await this.userAccountRepository.findById(userId);

    if (!userAccount) return false;

    return permissionsToValidate.every((permission) =>
      userAccount?.can(permission),
    );
  }
}
