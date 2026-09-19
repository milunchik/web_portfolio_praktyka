# Architecture Decision Records (ADRs)

This directory contains lightweight Architecture Decision Records (ADRs) capturing key architectural decisions made in the codebase.

## Index

| ADR | Title | Status | Date |
| --- | ----- | ------ | ---- |
| [0001](./0001-monorepo-structure.md) | Monorepo Structure with Turborepo and npm Workspaces | Accepted | 2026-09-19 |
| [0002](./0002-clean-architecture-in-nestjs.md) | Clean Architecture & Repository Pattern in NestJS | Accepted | 2026-09-19 |
| [0003](./0003-authentication-and-session-management.md) | Dual-Token JWT Auth with Database Session Persistence | Accepted | 2026-09-19 |
| [0004](./0004-orm-and-database-layer.md) | PostgreSQL Database with Prisma ORM | Accepted | 2026-09-19 |
| [0005](./0005-frontend-architecture-and-state.md) | Next.js App Router and Zustand State Management | Accepted | 2026-09-19 |
| [0006](./0006-shared-contracts-layer.md) | Cross-Application Type Safety with `@repo/contracts` | Accepted | 2026-09-19 |

## Decision Record Format

Each ADR follows this structure:
1. **Title**: Short summary of the decision.
2. **Status**: Proposed, Accepted, Rejected, Deprecated, or Superseded.
3. **Context**: Motivation and constraints leading to the decision.
4. **Decision**: What was chosen and why.
5. **Consequences**: Trade-offs, benefits, and drawbacks of the decision.
