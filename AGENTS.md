# Agent Skills — auth

Project-specific skills for AI agents working on this repository.
Load the relevant skill(s) before making changes.

## Skills

| Skill | When to load | File |
|-------|-------------|------|
| `auth-domain-model` | Creating/modifying domain entities, working with toPrimitive(), adding getters | [SKILL.md](.claude/skills/auth-domain-model/SKILL.md) |
| `auth-repository-pattern` | Creating repositories, adding methods, binding in modules | [SKILL.md](.claude/skills/auth-repository-pattern/SKILL.md) |
| `auth-typeorm-conventions` | Creating TypeORM entities, adding columns/relations, writing migrations | [SKILL.md](.claude/skills/auth-typeorm-conventions/SKILL.md) |
| `auth-module-structure` | Creating NestJS modules, changing imports/exports, adding use cases to modules | [SKILL.md](.claude/skills/auth-module-structure/SKILL.md) |
| `auth-testing-patterns` | Writing tests, setting up TestingModule, testing protected endpoints | [SKILL.md](.claude/skills/auth-testing-patterns/SKILL.md) |
| `auth-api-conventions` | Adding endpoints, creating DTOs, working in src/api/ | [SKILL.md](.claude/skills/auth-api-conventions/SKILL.md) |

## Stack

NestJS 11 · TypeScript 5.7 · TypeORM 0.3 · PostgreSQL · pnpm

## Architecture

Hexagonal Architecture — `domain/` → `application/` → `infrastructure/`

Controllers centralized in `src/api/v1/{concern}/`, domain modules in `src/{domain}/`.
