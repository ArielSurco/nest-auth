import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }

    return request.user;
  },
);
