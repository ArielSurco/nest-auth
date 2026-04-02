---
name: auth-api-conventions
description: >
  HTTP API conventions for the auth project — controllers, DTOs, and response shape.
  Trigger: When creating a new controller, adding an endpoint, creating a DTO,
  or working inside src/api/.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Adding a new endpoint to an existing controller
- Creating a new controller for a new domain
- Creating or modifying a DTO
- Working in `src/api/v1/`

## Critical Patterns

### File structure: one folder per concern

```
src/api/v1/
  {concern}/
    {concern}.controller.ts
    {concern}.controller.spec.ts
    dtos/
      CreateXxxDto.ts
      UpdateXxxDto.ts
```

Each concern group (auth, permissions, roles) has its own folder. DTOs live inside `dtos/` within that folder. Never put DTOs in a shared top-level folder.

### Versioning in the controller prefix

```typescript
@Controller('v1/permission')   // versioned path
@Controller('v1/role')
@Controller('v1/auth')
```

Version (`v1`) is part of the controller path, not a global prefix or NestJS versioning config.

### Decorator order on protected endpoints

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
@UsePipes(new ValidationPipe({ transform: true }))
@Permissions([GlobalPermissionCode.CREATE_PERMISSION])
@UseGuards(AuthGuard)
```

Order matters: `@Permissions` **before** `@UseGuards`. The guard reads `@Permissions` metadata via `Reflector` at runtime — if the order is wrong, the guard runs before the metadata is set.

### Always explicit @HttpCode

```typescript
@HttpCode(HttpStatus.CREATED)   // POST
@HttpCode(HttpStatus.OK)        // GET, DELETE
```

Never rely on NestJS defaults.

### @UsePipes only on endpoints that receive @Body

```typescript
@Post()
@UsePipes(new ValidationPipe({ transform: true }))  // only where @Body is used
async create(@Body() dto: CreatePermissionDto) { ... }

@Get()
// no @UsePipes here
async getAll() { ... }
```

### Response as projected plain object — never the domain entity

```typescript
// CORRECT — project only what the client needs
return {
  id: result.id,
  code: result.code,
  message: 'Permission created successfully',
};

// WRONG — never return the domain object directly
return result;
return result.toPrimitive();
```

New fields added to the domain entity do NOT automatically appear in HTTP responses. They must be explicitly added to the controller response shape.

### Use case injection suffix: UseCase

```typescript
constructor(
  private readonly createPermissionUseCase: CreatePermission,
  private readonly getAllPermissionsUseCase: GetAllPermissions,
)
```

### DTO validation rules

- Use `class-validator` decorators
- Permission/role `code` fields: `@Matches(/^[a-z]+(\.[a-z]+)*$/)` — lowercase dot-separated format (e.g. `global.permissions.create`)
- Optional arrays: `@IsArray() @IsString({ each: true }) @IsOptional()`

```typescript
export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+(\.[a-z]+)*$/, {
    message: 'Code must be in lowercase dot-separated format (e.g. global.permissions.create)',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### GlobalPermissionCode format

All permission codes (system and user-created) use lowercase dot-separated format:

```typescript
// GlobalPermissionCode enum
CREATE_PERMISSION = 'global.permissions.create'
CREATE_ROLE = 'global.roles.create'
```

### Adding a new controller

1. Create `src/api/v1/{concern}/{concern}.controller.ts`
2. Create `src/api/v1/{concern}/{concern}.controller.spec.ts`
3. Create `src/api/v1/{concern}/dtos/` with DTOs
4. Add the controller to `ApiModule.controllers[]`
5. Ensure `ApiModule` imports the domain module that provides the required use cases

## Commands

```bash
pnpm tsc --noEmit
pnpm test
pnpm lint
```
