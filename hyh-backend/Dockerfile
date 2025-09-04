FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci

# Copy sources
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Build + generate Prisma Client
RUN npm run build && npx prisma generate

# ---- Runner ----
FROM node:20-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy app and node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 4000

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]

