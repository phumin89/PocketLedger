# PocketLedger

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white)](https://www.docker.com/)

PocketLedger is a starter monorepo for an income and expense tracking product. It uses a separate SPA frontend, a REST API backend, an application layer for CQRS handlers, and PostgreSQL for durable financial data.

## Frameworks

- Frontend framework: React 19 + Vite
- Backend framework: Fastify 5
- ORM and database tooling: Prisma 7
- Database: PostgreSQL 16
- Language: TypeScript 5
- Local orchestration: Docker Compose

## Stack choice

- Frontend: React + Vite + TypeScript
- Backend: Fastify + TypeScript
- Database: PostgreSQL + Prisma

PostgreSQL is the right default here because financial data is relational, query-heavy, and benefits from strong constraints and decimal-safe storage.

## CQRS-ready structure

The codebase is structured so reads and writes are separated from the start:

- `backend` contains controllers, API contracts, and CQRS request definitions
- `application` contains command handlers and query handlers
- `database` contains Prisma schema, models, generated client, and migrations

This keeps the first version readable while leaving room for event-driven workflows, background projections, or separate read stores later.

## Project structure

```text
PocketLedger/
  frontend/     React SPA
  backend/      Fastify API, controllers, CQRS contracts
  application/  CQRS command and query handlers
  database/     Prisma schema, generated client, migrations
```

## Quick start

1. Install dependencies:

    ```bash
    npm install
    ```

2. Copy the backend environment file:

    ```bash
    copy backend\\.env.example backend\\.env
    ```

3. Start PostgreSQL with Docker:

    ```bash
    docker compose up -d
    ```

4. Generate Prisma client and run migrations:

    ```bash
    npm run db:generate
    npm run db:migrate
    ```

5. Start both apps:

    ```bash
    npm run dev
    ```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:3000`.

## Recommended dev mode

For this project, the best fit is Docker Compose in dev mode so PostgreSQL, the API, and the SPA all show up as services in Docker Desktop with published ports.

- `npm run dev:docker` starts the full stack with Docker Compose Watch
- `npm run dev:docker:detached` starts the same stack in the background
- `npm run dev:docker:down` stops the full Docker dev stack
- `npm run dev:local` keeps the old local-process workflow for frontend and backend
- `npm run db:up` starts only PostgreSQL
- `npm run db:down` stops only PostgreSQL
- `npm run db:logs` tails PostgreSQL logs
- `npm run db:studio:docker` starts Prisma Studio in Docker

Docker Desktop will expose:

- Frontend on `http://localhost:4200`
- Backend on `http://localhost:4201`
- Prisma Studio on `http://localhost:4202`
- PostgreSQL on `localhost:5432`

When using Docker dev mode, run:

```bash
npm run dev:docker
```

Compose Watch keeps the containers running and syncs source changes for frontend and backend while rebuilding when package or Prisma schema files change.

## Formatting

The repo uses Prettier at the root so the same formatter applies to TypeScript, HTML, JSON, Markdown, and SCSS.
It also organizes TypeScript imports automatically during formatting.

- `npm run format` formats the repo
- `npm run format:check` checks formatting without changing files
