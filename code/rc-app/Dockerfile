# Base stage with dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ openssl

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies (postinstall will run prisma generate)
RUN npm install --legacy-peer-deps

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV APP_ENV=prod

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations and seed before starting the app
CMD ["/bin/sh", "-c", "npm run db:migrate:deploy && npm run db:seed && node server.js"]
