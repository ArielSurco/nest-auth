import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GlobalPermissionCode } from 'src/permissions/domain/GlobalPermissionCode';
import { CreateRole } from '../../../roles/application/createRole';
import { GetAllRoles } from '../../../roles/application/getAllRoles';
import { Permissions } from '../../../auth/infrastructure/decorators/permission.decorator';
import { AuthGuard } from '../../../auth/infrastructure/guards/auth.guard';
import { CreateRoleDto } from './CreateRoleDto';

@Controller('v1/role')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRole,
    private readonly getAllRolesUseCase: GetAllRoles,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Permissions([GlobalPermissionCode.CREATE_ROLE])
  @UseGuards(AuthGuard)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.createRoleUseCase.execute({
      code: createRoleDto.code,
      name: createRoleDto.name,
      permissionIds: createRoleDto.permissionIds,
    });

    const rolePrimitive = result.toPrimitive();

    return {
      id: rolePrimitive.id,
      code: rolePrimitive.code,
      name: rolePrimitive.name,
      permissions: rolePrimitive.permissions,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllRoles() {
    const roles = await this.getAllRolesUseCase.execute();

    const rolesPrimitive = roles.map((role) => role.toPrimitive());

    return rolesPrimitive.map((role) => ({
      id: role.id,
      code: role.code,
      name: role.name,
      permissions: role.permissions.map((permission) => ({
        id: permission.id,
        code: permission.code,
        name: permission.name,
      })),
    }));
  }
}
