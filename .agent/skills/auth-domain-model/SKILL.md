---
name: auth-domain-model
description: >
  Conventions for creating and extending domain entities in the auth project.
  Trigger: When creating a new domain class, adding fields to an existing entity,
  adding getters, or working with toPrimitive() / domain attributes.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Creating a new domain entity (e.g. `Profile`, `Session`)
- Adding fields, methods, or getters to an existing entity
- Mapping between domain and HTTP response
- Working with `toPrimitive()` or `XAttributes` / `XPrimitive`

## Critical Patterns

### Dual interface: Attributes vs Primitive

Every entity has two interfaces:

| Interface | Purpose | Types used |
|-----------|---------|------------|
| `XAttributes` | Internal domain state | Native (`Date`, related domain objects like `Role[]`) |
| `XPrimitive` | Serializable form | `string` for dates (ISO), primitives of related objects |

```typescript
export interface RoleAttributes {
  id: string;
  permissions: Permission[];   // domain object
  createdAt: Date;             // native Date
}

export interface RolePrimitive
  extends Omit<RoleAttributes, 'permissions' | 'createdAt' | 'updatedAt'> {
  permissions: PermissionPrimitive[];  // serializable
  createdAt: string;                   // ISO string
}
```

### Invariant class structure

Every domain class MUST follow this structure exactly:

```typescript
export class Permission {
  // 1. Private constructor — never instantiate directly
  constructor(private readonly attributes: PermissionAttributes) {}

  // 2. Static factory — use CustomPartial for fields with defaults
  static create({
    id = uuidv4(),
    createdAt = new Date(),
    updatedAt = new Date(),
    ...attributes
  }: CustomPartial<PermissionAttributes, 'id' | 'createdAt' | 'updatedAt'>) {
    return new Permission({ id, createdAt, updatedAt, ...attributes });
  }

  // 3. toPrimitive() — used in HTTP responses and entity mapping (fromDomain)
  toPrimitive(): PermissionPrimitive {
    return {
      id: this.attributes.id,
      code: this.attributes.code,
      name: this.attributes.name,
      createdAt: this.attributes.createdAt.toISOString(),
      updatedAt: this.attributes.updatedAt.toISOString(),
    };
  }

  // 4. Getters — add when a field is accessed frequently without needing full toPrimitive()
  get id(): string { return this.attributes.id; }
  get code(): string { return this.attributes.code; }

  // 5. Domain behavior methods
  is(code: PermissionAttributes['code']): boolean {
    return this.attributes.code === code;
  }
}
```

### CustomPartial

`CustomPartial<T, K>` makes only fields `K` optional in `T`. Always use it in `create()` for fields that have defaults:

```typescript
import { CustomPartial } from 'src/shared/types/CustomPartial';

// Fields with defaults: id, createdAt, updatedAt, active, roles, permissions
static create({
  id = uuidv4(),
  active = true,
  roles = [],
  ...
}: CustomPartial<UserAccountAttributes, 'id' | 'active' | 'roles' | 'createdAt' | 'updatedAt'>)
```

### Default values by field

| Field | Default |
|-------|---------|
| `id` | `uuidv4()` |
| `createdAt` | `new Date()` |
| `updatedAt` | `new Date()` |
| `active` | `true` |
| `permissions` (Role) | `[]` |
| `roles` (UserAccount) | `[]` |

### Getters: pragmatic rule

Add a getter when a specific field is accessed frequently and calling `toPrimitive()` just for one attribute would be wasteful. There is no rule requiring all fields to have getters.

```typescript
// Use getter when accessed directly often (e.g. in guards, use cases)
get id(): string { return this.attributes.id; }
get email(): string { return this.attributes.email; }

// Use toPrimitive() when you need the full serialized form (HTTP responses)
return {
  id: result.toPrimitive().id,
  ...
};
```

### Collections are readonly

```typescript
get permissions(): readonly Permission[] { return this.attributes.permissions; }
get roles(): readonly Role[] { return this.attributes.roles; }
```

### Authorization chain

Permission checks delegate down the entity chain — never implement in services:

```
UserAccount.can(permissionCode)
  → Role.can(permissionCode)
    → Permission.is(permissionCode)
```

## Commands

```bash
pnpm tsc --noEmit   # verify types after changes
pnpm test           # run all tests
```
