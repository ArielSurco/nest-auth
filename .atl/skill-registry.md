# Skill Registry — auth

Generated: 2026-04-02

## User Skills (Global)

| Skill | Triggers |
|-------|----------|
| `branch-pr` | Creating PRs, opening pull requests |
| `issue-creation` | Creating GitHub issues, reporting bugs |
| `judgment-day` | Parallel adversarial review, code review |
| `sdd-apply` | Implement SDD tasks |
| `sdd-archive` | Archive a completed SDD change |
| `sdd-design` | Write technical design for SDD change |
| `sdd-explore` | Explore ideas before committing to a change |
| `sdd-init` | Initialize SDD context in a project |
| `sdd-propose` | Create a change proposal |
| `sdd-spec` | Write specs with requirements and scenarios |
| `sdd-tasks` | Break down a change into tasks |
| `sdd-verify` | Validate implementation against specs |
| `skill-creator` | Creating new AI agent skills |

## Project Conventions

No project-level CLAUDE.md or agents.md found.

## Compact Rules

### NestJS / TypeScript (auth)
- Use `@nestjs/testing` TestingModule for unit/integration tests
- Use Memory repositories (not Pg*) in tests — no DB needed
- Use conventional commits (no AI attribution)
- Follow Hexagonal layers: domain → application → infrastructure
- DTOs use class-validator decorators
- Never build after changes
