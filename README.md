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
```bash
npm start                           # Frontend
cd hyh-backend && npm run start:prod
```