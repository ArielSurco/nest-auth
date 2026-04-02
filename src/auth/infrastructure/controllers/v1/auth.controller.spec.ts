import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionPayload } from '../../services/session.service';
import { GetUserByCredentials } from '../../../application/getUserByCredentials';
import { GetUserById } from '../../../application/getUserById';
import { SignUp } from '../../../application/signUp';
import { UserAccountRepository } from '../../../domain/UserAccountRepository';
import { MemoryUserAccountRepository } from '../../repositories/MemoryUserAccountRepository';
import { SessionService } from '../../services/session.service';
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
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: UserAccountRepository,
          useClass: MemoryUserAccountRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_EXPIRES_IN') return '1h';
              return 'mock-config-value';
            }),
          },
        },
        SessionService,
        SignUp,
        GetUserByCredentials,
        GetUserById,
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
    userAccountRepository = moduleRef.get(UserAccountRepository);
  });

  describe('signUp', () => {
    it('should create a new user account when payload is valid', async () => {
      const response = await authController.signUp(defaultPayload);
      const createdUserAccount =
        await userAccountRepository.findByEmail(defaultPayload.email);

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

  describe('signIn', () => {
    it('should return a token when credentials are valid', async () => {
      await authController.signUp(defaultPayload);

      const response = await authController.signIn({
        email: defaultPayload.email,
        password: defaultPayload.password,
      });

      expect(response.token).toBeDefined();
    });

    it('should return an error when credentials are invalid', async () => {
      await authController.signUp(defaultPayload);

      try {
        await authController.signIn({
          email: 'invalid@test.com',
          password: 'Invalid@123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect((error as Error).message).toBe('Invalid credentials');
      }
    });
  });

  describe('me', () => {
    it('should return user data when session is valid', async () => {
      const { id } = await authController.signUp(defaultPayload);

      const result = await authController.me({ userId: id } as SessionPayload);

      expect(result).toEqual({
        id,
        username: defaultPayload.username,
        email: defaultPayload.email,
      });
    });

    it('should throw UnauthorizedException when userId does not exist', async () => {
      await expect(
        authController.me({ userId: 'non-existent-id' } as SessionPayload),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
