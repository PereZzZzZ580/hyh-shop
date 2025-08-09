# HyH Backend Starter (NestJS + Prisma)

## Requisitos
- Node.js 20
- Docker (para Postgres/Redis)

## Setup rápido
```bash
cp .env.example .env
npm i
npm run docker:up
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
# -> API http://localhost:4000
# -> Docs http://localhost:4000/docs
