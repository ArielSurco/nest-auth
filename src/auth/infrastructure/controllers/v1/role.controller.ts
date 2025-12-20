import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRole } from '../../../application/createRole';
import { GetAllRoles } from '../../../application/getAllRoles';
import { CreateRoleDto } from './dtos/CreateRoleDto';

@Controller('v1/role')
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRole,
    private readonly getAllRolesUseCase: GetAllRoles,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.createRoleUseCase.execute({
      code: createRoleDto.code,
      name: createRoleDto.name,
      permissionIds: createRoleDto.permissionIds,
    });

    return {
      id: result.toPrimitive().id,
      code: result.toPrimitive().code,
      name: result.toPrimitive().name,
      permissions: result.toPrimitive().permissions,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllRoles() {
    const roles = await this.getAllRolesUseCase.execute();

    return roles.map((role) => ({
      id: role.toPrimitive().id,
      code: role.toPrimitive().code,
      name: role.toPrimitive().name,
      permissions: role.toPrimitive().permissions.map((permission) => ({
        id: permission.id,
        code: permission.code,
        name: permission.name,
      })),
    }));
  }
}
