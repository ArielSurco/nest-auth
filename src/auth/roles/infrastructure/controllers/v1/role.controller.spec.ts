import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateRole } from '../../../application/createRole';
import { GetAllRoles } from '../../../application/getAllRoles';
import { Permission } from '../../../../permissions/domain/Permission';
import { PermissionRepository } from '../../../../permissions/domain/PermissionRepository';
import { RoleRepository } from '../../../domain/RoleRepository';
import { MemoryPermissionRepository } from '../../../../permissions/infrastructure/repositories/MemoryPermissionRepository';
import { AuthGuard } from '../../../../infrastructure/guards/auth.guard';
import { MemoryRoleRepository } from '../../repositories/MemoryRoleRepository';
import { RoleController } from './role.controller';

describe('RoleController', () => {
  const defaultPayload = {
    code: 'TEST_ROLE',
    name: 'Test Role',
    permissionIds: [],
  };

  let moduleRef: TestingModule;

  let roleController: RoleController;
  let roleRepository: RoleRepository;
  let permissionRepository: PermissionRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [RoleController],
      providers: [
        {
          provide: PermissionRepository,
          useClass: MemoryPermissionRepository,
        },
        {
          provide: RoleRepository,
          useClass: MemoryRoleRepository,
        },
        CreateRole,
        GetAllRoles,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    roleController = moduleRef.get(RoleController);
    roleRepository = moduleRef.get(RoleRepository);
    permissionRepository = moduleRef.get(PermissionRepository);
  });

  describe('createRole', () => {
    it('should create a new role when payload is valid', async () => {
      const response = await roleController.createRole({
        name: defaultPayload.name,
        code: defaultPayload.code,
        permissionIds: [],
      });

      const createdRole = await roleRepository.findByCode(response.code);

      expect(createdRole?.toPrimitive()).toEqual(
        expect.objectContaining({
          code: defaultPayload.code,
          name: defaultPayload.name,
          permissions: [],
        }),
      );
    });

    it('should link the role to the permissions when permissionIds are provided', async () => {
      const permissionPayload = {
        name: 'Test Permission',
        code: 'TEST_PERMISSION',
      };
      const permission = await permissionRepository.create(
        Permission.create(permissionPayload),
      );
      const response = await roleController.createRole({
        ...defaultPayload,
        permissionIds: [permission.toPrimitive().id],
      });

      const createdRole = await roleRepository.findByCode(response.code);

      expect(createdRole?.toPrimitive().permissions).toEqual(
        expect.arrayContaining([permission.toPrimitive()]),
      );
    });

    it('should throw a BadRequestException when the role code already exists', async () => {
      await roleController.createRole(defaultPayload);

      try {
        await roleController.createRole({
          code: defaultPayload.code,
          name: 'Another Role',
          permissionIds: [],
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }

      const role = await roleRepository.findByCode(defaultPayload.code);

      expect(role?.toPrimitive().name).toBe(defaultPayload.name);
    });
  });

  describe('getAllRoles', () => {
    it('should return all created roles', async () => {
      const payload1 = {
        code: defaultPayload.code,
        name: defaultPayload.name,
        permissionIds: [],
      };
      const payload2 = {
        code: 'TEST_ROLE_2',
        name: 'Test Role 2',
        permissionIds: [],
      };

      await roleController.createRole(payload1);
      await roleController.createRole(payload2);

      const response = await roleController.getAllRoles();

      expect(response).toHaveLength(2);
      expect(response[0].code).toBe(payload1.code);
      expect(response[0].name).toBe(payload1.name);
      expect(response[1].code).toBe(payload2.code);
      expect(response[1].name).toBe(payload2.name);
    });
  });
});
