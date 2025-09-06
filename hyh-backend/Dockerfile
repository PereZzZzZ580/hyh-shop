FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci

# Copy sources
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Build (includes prisma generate via npm scripts)
RUN npm run build

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
CMD ["npm", "run", "start:migrate"]

