# HyH Shop

Aplicación full‑stack que combina un front‑end **Next.js** y un backend **NestJS** con **Prisma**.

## Requisitos
- Node.js 20
- Docker (para base de datos PostgreSQL y Redis en el backend)

## Variables de entorno
Copia los archivos de ejemplo y ajusta los valores necesarios:

```bash
cp .env.production .env.production
cp hyh-backend/.env
```

### Frontend (`.env`)
- `NEXT_PUBLIC_API_URL`: URL del backend.

### Backend (`hyh-backend/.env`)
- `DATABASE_URL` / `DIRECT_URL`: conexión a PostgreSQL.
- `JWT_SECRET`: clave para firmar los JWT.
- `CORS_ORIGIN`: origen permitido para CORS.
- `PORT`: puerto HTTP del backend.

## Desarrollo local
```bash
# Backend
cd hyh-backend
npm install
npm run docker:up
npm run prisma:migrate
npm run dev

# Frontend
cd ..
npm install
npm run dev
```

## Pruebas
```bash
npm test
cd hyh-backend && npm test
```

## Build de producción
```bash
npm run build        # Frontend (incluye prisma generate)
cd hyh-backend && npm run build
```

## Despliegue
Puedes desplegar con Docker (todo en un servidor) o usar Vercel + Render/Railway.

### Opción A: Docker (frontend + backend)

1) Variables del backend: crea `hyh-backend/.env` a partir de `hyh-backend/.env.example`.
2) Construir e iniciar en producción:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
3) Accede a:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000 (docs en /docs)

Para personalizar el API del frontend, exporta `NEXT_PUBLIC_API_URL` antes de construir o edita `docker-compose.prod.yml`.

### Opción B: Vercel (frontend) + Render/Railway (backend)

Backend (Render/Railway):
- Build: `npm ci && npm run build && npx prisma migrate deploy`
- Start: `npm run start:prod`
- Node: 20
- Variables: ver `hyh-backend/.env.example`

Frontend (Vercel):
- Framework: Next.js
- Build Command: `npm run build`
- Env: `NEXT_PUBLIC_API_URL=https://tu-api`
