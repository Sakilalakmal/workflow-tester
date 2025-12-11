# Dockerfile for Next.js Application with Prisma
# Multi-stage build optimized for production

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time environment variables (can be overridden during build)
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_placeholder"
ARG CLERK_SECRET_KEY="sk_test_placeholder"

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Generate Prisma Client (custom output location)
RUN pnpm exec prisma generate

# Build Next.js app with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Copy public folder
COPY --from=builder /app/public ./public

# Copy prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma Client (custom location)
COPY --from=builder --chown=nextjs:nodejs /app/lib/generated ./lib/generated

# Copy node_modules
COPY --from=builder /app/node_modules ./node_modules

# Copy Next.js build output - use the main .next folder, not standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check (optional - remove if no health endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Use Next.js start command instead of standalone server.js
CMD ["node_modules/.bin/next", "start"]
