import { UserAccount } from '../../domain/UserAccount';
import { MemoryUserAccountRepository } from './MemoryUserAccountRepository';

describe('MemoryUserAccountRepository', () => {
  let repo: MemoryUserAccountRepository;

  beforeEach(() => {
    repo = new MemoryUserAccountRepository();
  });

  describe('findByEmail', () => {
    it('should return the user when email exists', async () => {
      const user = UserAccount.create({
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed-password',
      });
      await repo.create(user);

      const result = await repo.findByEmail('test@test.com');

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@test.com');
    });

    it('should return null when email does not exist', async () => {
      const result = await repo.findByEmail('nonexistent@test.com');

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return the user when username exists', async () => {
      const user = UserAccount.create({
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed-password',
      });
      await repo.create(user);

      const result = await repo.findByUsername('testuser');

      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
    });

    it('should return null when username does not exist', async () => {
      const result = await repo.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });
});
