import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePermission } from '../../../application/createPermission';
import { GetAllPermissions } from '../../../application/getAllPermissions';
import { PermissionRepository } from '../../../domain/PermissionRepository';
import { MemoryPermissionRepository } from '../../../infrastructure/repositories/MemoryPermissionRepository';
import { AuthGuard } from '../../../../auth/infrastructure/guards/auth.guard';
import { PermissionController } from './permission.controller';

describe('PermissionController', () => {
  const defaultPayload = {
    code: 'TEST_PERMISSION',
    name: 'Test Permission',
  };

  let moduleRef: TestingModule;

  let permissionController: PermissionController;
  let permissionRepository: PermissionRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionRepository,
          useClass: MemoryPermissionRepository,
        },
        CreatePermission,
        GetAllPermissions,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    permissionController = moduleRef.get(PermissionController);
    permissionRepository = moduleRef.get(PermissionRepository);
  });

  describe('createPermission', () => {
    it('should create a new permission when payload is valid', async () => {
      const response =
        await permissionController.createPermission(defaultPayload);

      const createdPermission = await permissionRepository.findByCode(
        response.code,
      );

      expect(createdPermission).toBeDefined();
      expect(createdPermission?.toPrimitive()).toEqual(
        expect.objectContaining({
          code: defaultPayload.code,
          name: defaultPayload.name,
        }),
      );
    });

    it('should not create a new permission for an existing code', async () => {
      await permissionController.createPermission(defaultPayload);

      try {
        await permissionController.createPermission({
          code: defaultPayload.code,
          name: 'Another Permission',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }

      const permission = await permissionRepository.findByCode(
        defaultPayload.code,
      );

      expect(permission?.toPrimitive().name).toBe(defaultPayload.name);
    });
  });

  describe('getPermissions', () => {
    it('should return all created permissions', async () => {
      const payload1 = defaultPayload;
      const payload2 = {
        code: 'TEST_PERMISSION_2',
        name: 'Test Permission 2',
      };

      await permissionController.createPermission(payload1);
      await permissionController.createPermission(payload2);

      const response = await permissionController.getPermissions();

      expect(response).toHaveLength(2);
      expect(response[0].code).toBe(payload1.code);
      expect(response[0].name).toBe(payload1.name);
      expect(response[1].code).toBe(payload2.code);
      expect(response[1].name).toBe(payload2.name);
    });
  });
});
