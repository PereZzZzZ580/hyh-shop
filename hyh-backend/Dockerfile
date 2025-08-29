# ---- Backend (NestJS) production image ----
FROM node:20-slim AS builder
WORKDIR /app

# Install deps first
COPY hyh-backend/package*.json ./
RUN npm ci

# Copy source
COPY hyh-backend/tsconfig.json ./
COPY hyh-backend/src ./src
COPY hyh-backend/prisma ./prisma

# Build + generate Prisma client
RUN npm run build && npx prisma generate

# ---- Runner ----
FROM node:20-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy built app and node_modules (keeps prisma CLI available for migrate deploy)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY hyh-backend/package*.json ./

EXPOSE 4000

# Run DB migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

