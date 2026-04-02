import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserAccountRepository } from '../../users/domain/UserAccountRepository';
import { MemoryUserAccountRepository } from '../../users/infrastructure/repositories/MemoryUserAccountRepository';
import { GetUserById } from './getUserById';

describe('GetUserById', () => {
  let getUserById: GetUserById;
  let userAccountRepository: UserAccountRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: UserAccountRepository,
          useClass: MemoryUserAccountRepository,
        },
        GetUserById,
      ],
    }).compile();

    getUserById = moduleRef.get(GetUserById);
    userAccountRepository = moduleRef.get(UserAccountRepository);
  });

  it('should return UserAccount when id exists', async () => {
    const { UserAccount } = await import('../../users/domain/UserAccount');
    const user = UserAccount.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'hashed-password',
    });
    await userAccountRepository.create(user);

    const result = await getUserById.execute(user.id);

    expect(result).toBeDefined();
    expect(result.id).toBe(user.id);
    expect(result.email).toBe('test@test.com');
    expect(result.username).toBe('testuser');
  });

  it('should throw UnauthorizedException when id does not exist', async () => {
    await expect(getUserById.execute('non-existent-id')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
