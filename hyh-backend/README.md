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

```

## Variables de entorno

El archivo `.env` incluye las variables necesarias:

- `DATABASE_URL` y `DIRECT_URL`: conexión a PostgreSQL.
- `JWT_SECRET`: clave para firmar los tokens.
- `CORS_ORIGIN`: URL permitida para CORS.
- `PORT`: puerto del servidor HTTP.

Copie el archivo y ajuste los valores antes de ejecutar en producción.

## Build de producción

```bash
npm run build
npm run start:prod
```

## Roles de usuario
Los usuarios registrados se crean con el rol `CUSTOMER` por defecto. El primer usuario con rol `ADMIN` debe crearse manualmente o mediante un endpoint restringido.
