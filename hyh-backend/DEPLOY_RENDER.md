# Despliegue en Render (hyh-backend)

Este backend (NestJS + Prisma) está preparado para Render usando Docker.

## Opción A — Blueprint (recomendado)

1) Verifica el archivo `render.yaml` en la raíz del repo.
2) En Render, crea un Blueprint desde el repositorio.
3) Revisa/ajusta:
   - Planes (por defecto `starter`).
   - Región (por ejemplo `oregon`).
   - Variables de entorno (Cloudinary, Wompi, etc.).
4) Aplica el blueprint. Render creará:
   - Servicio web `hyh-backend` (Docker) con health check en `/health`.
   - Base de datos PostgreSQL `hyh-postgres` y enlazará `DATABASE_URL`/`DIRECT_URL`.

Notas:
- `JWT_SECRET` se genera automáticamente en el blueprint.
- La app escucha en `PORT` (por defecto 4000) y en `0.0.0.0`.
- Al iniciar, el contenedor aplica migraciones Prisma y arranca (`npm run start:migrate`).

## Opción B — Servicio manual (Docker)

Si prefieres crear el servicio manualmente en el dashboard:

- Tipo: Web Service – Docker
- Repositorio: este repo
- Dockerfile: `hyh-backend/Dockerfile`
- Contexto: `hyh-backend`
- Health check path: `/health`
- Env vars requeridas:
  - `DATABASE_URL` (y `DIRECT_URL` si aplica)
  - `JWT_SECRET`
  - `CORS_ORIGIN` (dominios del frontend, coma-separados; ej. `https://tu-sitio.vercel.app`)
  - Opcionales: Cloudinary (`CLOUDINARY_*`), Wompi (`WOMPI_*`, `FRONTEND_URL`), `ADMIN_SECRET`, `WHATSAPP_NUMBER`.

## Variables de entorno

Revisa `hyh-backend/.env.example` para la lista completa. Mínimas para producción:

- `DATABASE_URL`, `DIRECT_URL`
- `JWT_SECRET`
- `CORS_ORIGIN` (ej. `https://tu-sitio.vercel.app`)
- Si usas pagos Wompi: `WOMPI_ENV`, `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_INTEGRITY_KEY`, `FRONTEND_URL`
- Si usas media: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Comportamiento en Render

- Migraciones: `prisma migrate deploy` corre en cada arranque de contenedor.
- Healthcheck: usa `GET /health` (también existe `/healthz`).
- CORS: controla orígenes permitidos con `CORS_ORIGIN` (coma-separado).
- DB: el blueprint crea un Postgres y expone su `connectionString`.

## Con Vercel (frontend)

- En Vercel, define `NEXT_PUBLIC_API_URL` con la URL pública del servicio de Render (ej. `https://hyh-backend.onrender.com`).
- En Render, actualiza `CORS_ORIGIN` con tu dominio de Vercel (ej. `https://tu-sitio.vercel.app`).

