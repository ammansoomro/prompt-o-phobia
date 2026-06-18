# syntax=docker/dockerfile:1

# Single-stage build: install deps, generate the Prisma client, build Next.js,
# then run the production server. Debian-based image so Prisma's query engine
# (which needs OpenSSL) works out of the box.
FROM node:24-slim

WORKDIR /app

# Prisma's engines need OpenSSL at build- and run-time.
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies. Copy the Prisma schema first so the `postinstall`
# hook (`prisma generate`) can find it.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# Copy the rest of the source.
COPY . .

# NEXT_PUBLIC_* vars are inlined at build time, so the Clerk publishable key
# must be present when `next build` runs.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL \
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL \
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Apply the schema to the database, then start the server. `migrate deploy`
# runs any committed migrations; it is a no-op if they are already applied.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
