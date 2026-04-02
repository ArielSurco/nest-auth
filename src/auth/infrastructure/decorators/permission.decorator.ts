import { Reflector } from '@nestjs/core';
import { PermissionPrimitive } from 'src/permissions/domain/Permission';

export const Permissions =
  Reflector.createDecorator<PermissionPrimitive['code'][]>();
