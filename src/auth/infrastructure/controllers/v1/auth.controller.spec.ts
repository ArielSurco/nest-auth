import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignUp } from '../../../application/signUp';
import { UserAccountRepository } from '../../../domain/UserAccountRepository';
import { MemoryUserAccountRepository } from '../../repositories/MemoryUserAccountRepository';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const defaultPayload = {
    username: 'test',
    email: 'test@test.com',
    password: 'Test@123',
  };

  let moduleRef: TestingModule;

  let authController: AuthController;
  let userAccountRepository: UserAccountRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserAccountRepository,
          useClass: MemoryUserAccountRepository,
        },
        SignUp,
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
    userAccountRepository = moduleRef.get(UserAccountRepository);
  });

  describe('signUp', () => {
    it('should create a new user account when payload is valid', async () => {
      const response = await authController.signUp(defaultPayload);
      const createdUserAccount =
        await userAccountRepository.findByEmailOrUsername({
          email: defaultPayload.email,
          username: defaultPayload.username,
        });

      expect(response.id).toBeDefined();
      expect(createdUserAccount?.toPrimitive()).toEqual(
        expect.objectContaining({
          username: defaultPayload.username,
          email: defaultPayload.email,
        }),
      );
    });

    it('should return an error when we use an existing username or email', async () => {
      await authController.signUp(defaultPayload);

      try {
        await authController.signUp({
          username: defaultPayload.username,
          email: 'another@test.com',
          password: 'Another@123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as Error).message).toBe('User already exists');
      }

      try {
        await authController.signUp({
          username: 'another',
          email: defaultPayload.email,
          password: 'Another@123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as Error).message).toBe('User already exists');
      }
    });
  });
});
