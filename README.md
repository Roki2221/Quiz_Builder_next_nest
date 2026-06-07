# Quiz Builder

Full-stack quiz builder built with NestJS, Prisma, PostgreSQL, and Next.js.

## Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL)

## Quick Start

### 1. Start the database

```bash
docker compose up -d
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

The API runs at `http://localhost:3001`.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## API Endpoints

| Method | Route           | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/quizzes`      | Create a quiz with questions         |
| GET    | `/quizzes`      | List all quizzes (with question count) |
| GET    | `/quizzes/:id`  | Get quiz details with questions    |
| DELETE | `/quizzes/:id`  | Delete a quiz (cascades questions) |

## Frontend Routes

| Route            | Description                              |
|------------------|------------------------------------------|
| `/`              | Home page with quick links               |
| `/create`        | Build a quiz with dynamic questions      |
| `/quizzes`       | List all quizzes with delete buttons     |
| `/quizzes/:id`   | Read-only view of a single quiz          |

## Project Structure

```
backend/
  prisma/           Database schema and migrations
  src/quiz/         REST API (controller, service, DTOs)
  src/prisma/       Prisma client wrapper for NestJS
frontend/
  app/create/       Quiz builder form (React Hook Form + Zod)
  app/quizzes/      List and detail pages
  lib/api.ts        Fetch helpers for the backend API
  lib/schemas/      Zod validation for the create form
docker-compose.yml  Local PostgreSQL
```
