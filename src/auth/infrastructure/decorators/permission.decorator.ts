import { Reflector } from '@nestjs/core';
import { PermissionPrimitive } from 'src/auth/permissions/domain/Permission';

export const Permissions =
  Reflector.createDecorator<PermissionPrimitive['code'][]>();
