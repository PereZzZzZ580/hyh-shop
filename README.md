# HyH Shop

Aplicación full‑stack con frontend en Next.js y backend en NestJS + Prisma.

## Requisitos
- Node.js 20
- Docker (para base de datos local opcional)

## Variables de entorno

### Frontend (Vercel / local)
- `NEXT_PUBLIC_API_URL`: URL pública del backend.
- `PEXELS_API_KEY` (opcional): clave para el asesor de imágenes.

Para desarrollo local crea `.env.local` en la raíz:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

En Vercel, define `NEXT_PUBLIC_API_URL` apuntando a tu backend en Render.

### Backend (`hyh-backend/.env` para local)
- `DATABASE_URL` / `DIRECT_URL`: conexión a PostgreSQL.
- `JWT_SECRET`: clave para firmar los JWT.
- `CORS_ORIGIN`: orígenes permitidos (coma‑separados), ej. `http://localhost:3000`.
- `PORT`: puerto HTTP (por defecto 4000).
- Opcionales: `CLOUDINARY_*`, `WOMPI_*`, `FRONTEND_URL`, `WHATSAPP_NUMBER`, etc. Ver `hyh-backend/.env.example`.

## Desarrollo local
```
# Backend
cd hyh-backend
npm install
npm run docker:up
npm run prisma:migrate
npm run dev

# Frontend (en otra terminal)
cd ..
npm install
npm run dev
```

## Pruebas
```
npm test
cd hyh-backend && npm test
```

## Build de producción
```
npm run build        # Frontend
cd hyh-backend && npm run build
```

## Despliegue

### Vercel (frontend) + Render (backend)

Backend en Render (Docker):
- Usa el blueprint `render.yaml` (recomendado) o crea un Web Service con `hyh-backend/Dockerfile` y contexto `hyh-backend`.
- Node 20. Health check `/health`.
- Variables: ver `hyh-backend/.env.example` (mínimo: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CORS_ORIGIN`).
- El contenedor corre migraciones al iniciar (`npm run start:migrate`).

Frontend en Vercel (Next.js):
- Build Command: `npm run build`
- Define `NEXT_PUBLIC_API_URL` con la URL pública del backend.
- Si cambias el dominio en Vercel, actualiza `CORS_ORIGIN` en Render.

