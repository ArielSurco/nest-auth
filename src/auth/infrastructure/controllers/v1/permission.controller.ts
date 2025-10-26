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
import { CreatePermission } from '../../../application/createPermission';
import { GetAllPermissions } from '../../../application/getAllPermissions';
import { CreatePermissionDto } from './dtos/CreatePermissionDto';

@Controller('v1/permission')
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermission,
    private readonly getAllPermissionsUseCase: GetAllPermissions,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.createPermissionUseCase.execute({
      code: createPermissionDto.code,
      name: createPermissionDto.name,
    });

    return {
      id: result.toPrimitive().id,
      code: result.toPrimitive().code,
      message: 'Permission created successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPermissions() {
    const result = await this.getAllPermissionsUseCase.execute();

    return result.map((permission) => ({
      id: permission.toPrimitive().id,
      code: permission.toPrimitive().code,
      name: permission.toPrimitive().name,
    }));
  }
}
