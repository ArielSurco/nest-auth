---
name: auth-module-structure
description: >
  NestJS module structure and dependency graph for the auth project.
  Trigger: When creating a new domain module, adding a new dependency between modules,
  registering providers or controllers, or modifying AppModule / ApiModule.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Creating a new domain module (e.g. `ProfilesModule`)
- Adding a use case to an existing module
- Changing what a module imports or exports
- Adding a new controller or endpoint group

## Critical Patterns

### Module dependency graph

```
AppModule → ApiModule (+ TypeOrmModule, ConfigModule)

ApiModule → AuthModule, PermissionsModule, RolesModule

AuthModule → UsersModule, JwtModule
  exports: [AuthGuard, SessionService, UsersModule, SignUp, GetUserByCredentials, GetUserById]

UsersModule → (nothing)
  exports: [UserAccountRepository]

PermissionsModule → AuthModule
  exports: [PermissionRepository, CreatePermission, GetAllPermissions]

RolesModule → AuthModule, PermissionsModule
  exports: [RoleRepository, CreateRole, GetAllRoles]
```

**Key rule**: the graph is a DAG — no circular dependencies. `AuthModule` never imports `PermissionsModule` or `RolesModule`.

### AuthModule re-exports UsersModule

`AuthModule` exports `UsersModule` so that any module importing `AuthModule` (e.g. `PermissionsModule`, `RolesModule`) gets `UserAccountRepository` transitively. This is required because `AuthGuard` depends on `UserAccountRepository`.

```typescript
// auth.module.ts
exports: [AuthGuard, SessionService, UsersModule, SignUp, GetUserByCredentials, GetUserById]
```

If you forget this and `AuthGuard` is used in a module that only imports `AuthModule`, you will get:
> `UnknownDependenciesException: Nest can't resolve dependencies of the AuthGuard`

### Domain modules have NO controllers

Controllers live **only** in `ApiModule`. Domain modules declare `controllers: []`.

```typescript
// permissions.module.ts — CORRECT
@Module({
  imports: [AuthModule],
  controllers: [],               // no controllers
  providers: [CreatePermission, GetAllPermissions, { provide: PermissionRepository, ... }],
  exports: [PermissionRepository, CreatePermission, GetAllPermissions],
})

// WRONG — never declare controllers in domain modules
@Module({
  controllers: [PermissionController],  // ❌
})
```

### What each module type should export

| Module type | Must export |
|-------------|------------|
| Domain module | Repository abstract class + all use cases |
| AuthModule | AuthGuard + SessionService + UsersModule + auth use cases |
| UsersModule | UserAccountRepository |
| ApiModule | nothing (it's the HTTP entry point) |

### Adding a new domain module

1. Create `src/{domain}/{domain}.module.ts`
2. Add `imports: [AuthModule]` (for AuthGuard access)
3. Provide: `{ provide: XxxRepository, useClass: PgXxxRepository }` + use cases
4. Export: repository abstract class + all use cases
5. Import the new module in `ApiModule`
6. Add controllers to `ApiModule`, not to the domain module

```typescript
@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    CreateProfile,
    GetProfile,
    { provide: ProfileRepository, useClass: PgProfileRepository },
  ],
  exports: [ProfileRepository, CreateProfile, GetProfile],
})
export class ProfilesModule {}
```

### AppModule stays thin

`AppModule` only imports infrastructure and `ApiModule`. It does not import domain modules directly.

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(DataSourceOptions),
    ApiModule,
  ],
})
export class AppModule {}
```

### ApiModule imports domain modules for use case injection

```typescript
@Module({
  imports: [AuthModule, PermissionsModule, RolesModule],
  controllers: [AuthController, PermissionController, RoleController],
})
export class ApiModule {}
```

## Commands

```bash
pnpm tsc --noEmit   # catch circular dependency type errors
pnpm test           # verify DI resolves correctly at runtime
```
