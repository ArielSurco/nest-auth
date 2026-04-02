---
name: auth-repository-pattern
description: >
  Conventions for implementing repositories in the auth project.
  Trigger: When creating a new repository, adding methods to an existing one,
  or binding repositories in NestJS modules.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Adding a new repository method to the abstract class
- Creating `PgXxx` or `MemoryXxx` implementations
- Binding a repository in a NestJS module
- Writing tests that require a repository

## Critical Patterns

### Abstract class, not interface

Repositories are **abstract classes**, never TypeScript interfaces. This allows using them directly as NestJS injection tokens without a separate `Symbol`.

```typescript
// CORRECT
export abstract class PermissionRepository {
  abstract findById(id: string): Promise<Permission | null>;
}

// WRONG — do not use interface
export interface PermissionRepository { ... }
```

### Dual implementation (mandatory)

Every repository has exactly two implementations:

| Class | Purpose | Used in |
|-------|---------|---------|
| `PgXxxRepository` | Real TypeORM + PostgreSQL | Production |
| `MemoryXxxRepository` | In-memory array | Tests |

### MemoryXxxRepository conventions

Follow this exact pattern in Memory implementations:

```typescript
@Injectable()
export class MemoryPermissionRepository implements PermissionRepository {
  private permissions: Permission[] = [];

  async findById(id: string): Promise<Permission | null> {
    const foundPermission = this.permissions.find(
      (permission) => permission.id === id,
    );
    return Promise.resolve(foundPermission ? foundPermission : null);
  }
}
```

Rules:
- Private array field named after the entity (plural): `permissions`, `roles`, `userAccounts`
- Local variable named `found{Entity}` (not `p`, `r`, or `u`)
- Always `Promise.resolve(value)` — never `return value` directly
- Ternary `found ? found : null` — never `?? null` (inconsistent with existing code)

### PgXxxRepository conventions

```typescript
@Injectable()
export class PgPermissionRepository implements PermissionRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Permission | null> {
    const foundPermission = await this.dataSource
      .getRepository(PermissionEntity)
      .findOne({ where: { id } });

    return foundPermission?.toDomain() ?? null;
  }
}
```

Rules:
- Inject `DataSource` via `@InjectDataSource()` — NOT `@InjectRepository()`
- Use `dataSource.getRepository(XxxEntity)` on each call
- Return `entity?.toDomain() ?? null` for single results
- Return `entities.map(e => e.toDomain())` for collections

### Repositories receive and return domain objects

Never pass primitives, DTOs, or plain objects to/from repositories:

```typescript
// CORRECT
async create(permission: Permission): Promise<Permission>
async findById(id: string): Promise<Permission | null>

// WRONG
async create(data: CreatePermissionDto): Promise<PermissionPrimitive>
```

### Module binding

```typescript
{
  provide: PermissionRepository,    // abstract class as token
  useClass: PgPermissionRepository, // concrete implementation
}
```

In tests, override with:
```typescript
{
  provide: PermissionRepository,
  useClass: MemoryPermissionRepository,
}
```

### Naming conventions

| Element | Pattern | Example |
|---------|---------|---------|
| Abstract class | `XxxRepository` | `PermissionRepository` |
| Postgres impl | `PgXxxRepository` | `PgPermissionRepository` |
| Memory impl | `MemoryXxxRepository` | `MemoryPermissionRepository` |
| File names | camelCase | `pgPermissionRepository.ts` → actually `PgPermissionRepository.ts` (PascalCase) |

## Commands

```bash
pnpm tsc --noEmit
pnpm test
```
