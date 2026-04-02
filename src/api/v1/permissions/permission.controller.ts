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
import { CreatePermission } from '../../../permissions/application/createPermission';
import { GetAllPermissions } from '../../../permissions/application/getAllPermissions';
import { Permissions } from '../../../auth/infrastructure/decorators/permission.decorator';
import { AuthGuard } from '../../../auth/infrastructure/guards/auth.guard';
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
  @Permissions([GlobalPermissionCode.CREATE_PERMISSION])
  @UseGuards(AuthGuard)
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const result = await this.createPermissionUseCase.execute({
      code: createPermissionDto.code,
      name: createPermissionDto.name,
    });

    return {
      id: result.id,
      code: result.code,
      message: 'Permission created successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPermissions() {
    const result = await this.getAllPermissionsUseCase.execute();

    return result.map((permission) => ({
      id: permission.id,
      code: permission.code,
      name: permission.name,
    }));
  }
}
