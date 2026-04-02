---
name: auth-testing-patterns
description: >
  Testing conventions for the auth project.
  Trigger: When writing tests for controllers, use cases, or repositories,
  or when adding new test cases to existing spec files.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Writing a new spec file for a controller, use case, or repository
- Adding test cases to an existing spec
- Setting up a `TestingModule` for a controller test
- Testing a protected endpoint (with `AuthGuard`)

## Critical Patterns

### Use MemoryXxxRepository — never jest.fn() for repos

```typescript
// CORRECT
{
  provide: UserAccountRepository,
  useClass: MemoryUserAccountRepository,
}

// WRONG — do not mock repositories with jest.fn()
{
  provide: UserAccountRepository,
  useValue: { findByEmail: jest.fn() },
}
```

The `Memory*` implementations are real in-memory classes that implement the same abstract interface. Use them directly.

### TestingModule setup pattern

```typescript
describe('PermissionController', () => {
  let moduleRef: TestingModule;
  let controller: PermissionController;
  let repository: PermissionRepository;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        CreatePermission,
        GetAllPermissions,
        {
          provide: PermissionRepository,
          useClass: MemoryPermissionRepository,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(PermissionController);
    repository = moduleRef.get(PermissionRepository);
  });
});
```

### Override AuthGuard in controller tests

Never configure a real JWT for tests. Override the guard:

```typescript
.overrideGuard(AuthGuard)
.useValue({ canActivate: () => true })
```

### UUID is mocked globally

`jest.config.ts` maps `uuid` to a mock that always returns `'mock-uuid-v4'`. This means:

```typescript
// Both users get the same ID if no explicit id is passed
const user1 = UserAccount.create({ username: 'a', email: 'a@a.com', password: '...' });
const user2 = UserAccount.create({ username: 'b', email: 'b@b.com', password: '...' });
// user1.id === user2.id === 'mock-uuid-v4'  ← PROBLEM
```

**Always pass explicit IDs when creating multiple entities in the same test:**

```typescript
const user1 = UserAccount.create({ id: 'id-1', username: 'a', ... });
const user2 = UserAccount.create({ id: 'id-2', username: 'b', ... });
```

### Session simulation for protected endpoints

```typescript
import { SessionPayload } from '../../../auth/infrastructure/services/session.service';

const result = await controller.me({ userId: 'some-id' } as SessionPayload);
```

### Test structure: describe by method, cases by scenario

```typescript
describe('AuthController', () => {
  describe('signUp', () => {
    it('should create a new user account when payload is valid', ...)
    it('should return an error when using an existing username or email', ...)
  });

  describe('signIn', () => {
    it('should return a token when credentials are valid', ...)
    it('should return an error when credentials are invalid', ...)
  });

  describe('me', () => {
    it('should return user data when session is valid', ...)
    it('should throw UnauthorizedException when userId does not exist', ...)
  });
});
```

### Coverage exclusions

These files are excluded from coverage measurement — do not add coverage annotations to them:

- `src/db/**` (migrations, seeds)
- `**/*.module.ts`
- `**/infrastructure/entities/**`
- `main.ts`
- `**/*.spec.ts`

## Commands

```bash
pnpm test              # run all tests
pnpm test:watch        # watch mode
pnpm test:cov          # with coverage report
pnpm tsc --noEmit      # type-check before running tests
```
