# NestJS + Next.js TypeScript Monorepo

A full-stack TypeScript starter built as an npm workspace monorepo. It contains a NestJS backend, a Next.js frontend, and a shared package for type-safe contracts used by both applications.

## Technology stack

| Area                   | Technology                          |
| ---------------------- | ----------------------------------- |
| Backend                | NestJS 11, Express, TypeScript      |
| Frontend               | Next.js 16, React 19, TypeScript    |
| Shared code            | npm workspace package               |
| Monorepo orchestration | Turborepo                           |
| Package manager        | npm 11                              |
| Code quality           | ESLint, Prettier, strict TypeScript |

## Repository structure

```text
.
├── apps
│   ├── api                 # NestJS backend
│   │   ├── src
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web                 # Next.js frontend
│       ├── app
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── package.json
│       └── tsconfig.json
├── packages
│   └── contracts           # Types shared by the API and frontend
│       ├── src/index.ts
│       ├── package.json
│       └── tsconfig.json
├── .env.example
├── package.json            # Root scripts and workspaces
├── tsconfig.base.json      # Shared TypeScript settings
└── turbo.json              # Turborepo task configuration
```

## Requirements

- Node.js 22 or newer
- npm 11 or newer

Check the installed versions:

```bash
node --version
npm --version
```

## Installation

From the repository root, install all dependencies:

```bash
npm install
```

npm installs dependencies for the root and all packages listed in the root `workspaces` configuration. Do not run separate installations inside each application.

## Environment variables

The applications include development defaults, so a local environment file is optional. To customize the configuration, copy the example:

```bash
cp .env.example .env
```

| Variable  | Default                 | Used by | Description                                   |
| --------- | ----------------------- | ------- | --------------------------------------------- |
| `API_URL` | `http://localhost:3001` | Web     | Backend URL used during server-side rendering |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Web | Backend URL used by browser-side API requests |
| `WEB_URL` | `http://localhost:3000` | API     | Allowed frontend origin for CORS              |
| `PORT`    | `3001`                  | API     | Port on which the NestJS server listens       |

`API_URL` is intentionally not prefixed with `NEXT_PUBLIC_`. It is read by a Next.js Server Component and is not exposed to browser JavaScript.

The frontend authentication UI expects the backend to provide `POST /auth/login`, `POST
/auth/logout`, and `GET /auth/me`. These endpoints are intentionally not mocked; the UI reports an
API connection error until a real authentication implementation is available.

## Running in development

Start the frontend and backend together:

```bash
npm run dev
```

Turborepo starts each workspace's development process:

- Frontend: http://localhost:3000
- API health endpoint: http://localhost:3001/health

The frontend calls the health endpoint and displays either `ok` or `offline`.

## Running with Docker Compose

Build and start the production frontend and backend containers:

```bash
docker compose up --build
```

The frontend is available at http://localhost:3000 and the API health endpoint at
http://localhost:3001/health. Inside the Compose network, the frontend reaches the API at
`http://api:3001`.

Stop the services with:

```bash
docker compose down
```

### Run only the backend

```bash
npm run dev -w @repo/api
```

NestJS watches backend source files and restarts when they change.

The API loads `apps/api/.env` first, then the root `.env`; existing process environment
variables take precedence. Prisma reads `apps/api/.env`. For database commands, copy
`apps/api/.env.example` to `apps/api/.env` and set `DATABASE_URL` to your PostgreSQL instance.

```bash
npm run db:generate -w @repo/api
npm run db:migrate:deploy -w @repo/api
npm test -w @repo/api
```

Development and production builds generate the Prisma client automatically. Client
generation does not require a running database. Migration commands do, and modify
the configured database. The current application module exposes only `/health`;
the user and auth feature modules are not yet registered.

### Run only the frontend

```bash
npm run dev -w @repo/web
```

Next.js provides Fast Refresh for frontend changes.

## Available commands

Run these commands from the repository root:

| Command             | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Start all applications in development mode                |
| `npm run build`     | Create production builds for all workspaces               |
| `npm run lint`      | Run ESLint across all workspaces                          |
| `npm run typecheck` | Type-check all TypeScript projects without emitting files |
| `npm run format`    | Format the repository with Prettier                       |

Turborepo caches successful task results, making repeated checks faster when their inputs have not changed.

## Backend application

The backend entry point is `apps/api/src/main.ts`. It creates the NestJS application, enables CORS for the configured frontend origin, and listens on port `3001` by default.

### Existing endpoint

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "api"
}
```

Test it with curl:

```bash
curl http://localhost:3001/health
```

### Adding a NestJS feature

Run Nest CLI commands in the API workspace. For example, to generate a `users` feature:

```bash
npm exec -w @repo/api nest generate module users
npm exec -w @repo/api nest generate controller users
npm exec -w @repo/api nest generate service users
```

Generated files are placed under `apps/api/src`.

## Frontend application

The frontend uses the Next.js App Router. The root page is `apps/web/app/page.tsx`.

The current page is a Server Component. It calls the backend through `API_URL`, uses the shared `HealthResponse` type, and renders the API status.

For requests made directly from a Client Component, introduce a variable such as `NEXT_PUBLIC_API_URL`. Values prefixed with `NEXT_PUBLIC_` are included in the browser bundle and must not contain secrets.

## Shared contracts

`packages/contracts` contains transport types shared by the frontend and backend. Both applications depend on it as `@repo/contracts`.

The existing contract is:

```ts
export interface HealthResponse {
  status: 'ok';
  service: 'api';
}
```

Import shared types with:

```ts
import type { HealthResponse } from '@repo/contracts';
```

Good candidates for this package include request bodies, API responses, shared enums, and other transport-level types. Avoid placing React components, NestJS providers, database clients, or application-specific runtime code here.

The package exports TypeScript source directly. Next.js transpiles it through `transpilePackages`, while the API uses type-only imports that are removed from its compiled output.

## Installing dependencies

Install dependencies in the workspace that uses them.

Backend runtime dependency:

```bash
npm install -w @repo/api package-name
```

Frontend runtime dependency:

```bash
npm install -w @repo/web package-name
```

Workspace development dependency:

```bash
npm install -D -w @repo/api package-name
```

Install tooling at the root only when it applies to the whole repository:

```bash
npm install -D package-name
```

## Production build and startup

Build all workspaces:

```bash
npm run build
```

Start the compiled backend:

```bash
npm run start -w @repo/api
```

Start the production frontend:

```bash
npm run start -w @repo/web
```

In production, provide `API_URL`, `WEB_URL`, and `PORT` through the hosting environment. The API and frontend are separate processes and can be deployed and scaled independently.

## Quality checks

Before opening a pull request or deploying, run:

```bash
npm run typecheck
npm run lint
npm run build
```

Format the repository with:

```bash
npm run format
```

## Common issues

### The frontend displays `API status: offline`

Verify that the API is running and reachable from the Next.js server:

```bash
curl http://localhost:3001/health
```

If the API uses another host or port, update `API_URL`.

### Browser requests are rejected by CORS

Set `WEB_URL` to the exact frontend origin, including its protocol and port:

```env
WEB_URL=http://localhost:3000
```

The current CORS configuration accepts one frontend origin. Update `apps/api/src/main.ts` if multiple trusted origins are required.

### A workspace package cannot be resolved

Run installation from the repository root so npm creates all workspace links:

```bash
npm install
```

### Cached output appears stale

Turborepo detects input changes automatically. To bypass its cache for one build, run:

```bash
npx turbo build --force
```

## Suggested next steps

Common production additions include:

- Runtime request validation with NestJS DTOs and `class-validator`
- Database integration with Prisma, Drizzle, or TypeORM
- Authentication and authorization
- Unit and end-to-end tests
- OpenAPI/Swagger documentation
- Centralized environment validation
- Dockerfiles and deployment configuration
- Continuous integration for linting, type-checking, tests, and builds
