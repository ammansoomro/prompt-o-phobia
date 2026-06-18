# Prompt-O-Phobia

> An open-source platform for discovering, creating, and sharing AI prompts with the world.

Prompt-O-Phobia is a community-driven web application where users sign in with Google, publish their best AI prompts (tagged by topic), browse a global feed, search by author or tag, and manage their own collection. It is built on the **Next.js 15 App Router** with a **PostgreSQL** backend (via **Prisma**) and **Clerk** authentication, and ships with a **Docker Compose** setup for one-command local runs.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Build](#build)
- [Testing](#testing)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Prompt-O-Phobia solves a simple but real problem: **good AI prompts are hard to find and easy to lose.** The app gives users a shared, searchable home for prompt engineering ideas.

**Target users:** Prompt engineers, AI enthusiasts, writers, developers, and anyone experimenting with generative-AI tools who wants to discover proven prompts or share their own.

**Core workflow:**

1. A visitor lands on the home feed and browses/searches all community prompts — no account required to read.
2. To contribute, the user signs in or signs up with [Clerk](https://clerk.com/) (email, social logins, etc.).
3. On the first authenticated write, a user record is provisioned automatically in PostgreSQL, keyed to the Clerk user id.
4. The user creates a prompt with a body and a tag (e.g. `#productivity`).
5. Prompts appear in the global feed, are searchable by tag/username/content, and can be copied to the clipboard with one click.
6. From their profile, the user can edit or delete their own prompts. They can also click any author to view that creator's public profile and prompts.

---

## Features

- 🔐 **Clerk authentication** — hosted sign-in/sign-up, `<UserButton>` account management, route protection via middleware, and auto-provisioning of PostgreSQL users from the Clerk session.
- 📝 **Full CRUD for prompts** — create, read, update, and delete, with ownership enforced in the UI.
- 🌐 **Global prompt feed** — every published prompt rendered as a card with creator, content, and tag.
- 🔎 **Live search** — debounced, case-insensitive filtering by tag, username, or prompt content.
- 🏷️ **Tag-based discovery** — click any tag to instantly filter the feed.
- 📋 **One-click copy** — copy a prompt to the clipboard with visual confirmation.
- 👤 **Public & personal profiles** — view your own prompts (with edit/delete controls) or any other creator's prompts.
- 📱 **Responsive design** — dedicated desktop and mobile navigation, including a mobile dropdown menu.
- 🛡️ **Server-side ownership enforcement** — prompt create/edit/delete resolve the creator from the Clerk session and verify ownership in the API, not just the UI.
- ⚡ **Server Components + Route Handlers** — leverages the Next.js 15 App Router for data fetching and API routes.

---

## Tech Stack

| Category | Technology |
| --- | --- |
| **Language** | JavaScript (JSX), ES Modules |
| **Framework** | [Next.js 15.5](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3.3](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **Authentication** | [Clerk](https://clerk.com/) (`@clerk/nextjs` 7) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) |
| **ORM** | [Prisma 6](https://www.prisma.io/) |
| **Containerization** | [Docker](https://www.docker.com/) + Docker Compose |
| **Package Manager** | npm (`package-lock.json` present) |
| **Fonts** | Inter & Satoshi (custom Tailwind font families) |
| **Deployment** | Docker Compose (local) / [Vercel](https://vercel.com/) (app) |

> No testing framework or CI/CD configuration is present (see [Testing](#testing)). Linting is available via `next lint`.

---

## Architecture

Prompt-O-Phobia is a single Next.js application that serves both the frontend (React Server/Client Components) and the backend (App Router Route Handlers under `app/api`). Prisma connects to a PostgreSQL database, and Clerk handles authentication via `clerkMiddleware` and the `<ClerkProvider>`/component suite.

```mermaid
graph TD
    User([User / Browser])
    subgraph NextApp["Next.js 15 App"]
        MW["clerkMiddleware<br/>(middleware.js)"]
        Pages["React Pages & Components<br/>(Feed, Form, Profile, Nav)"]
        API["Route Handlers<br/>(app/api/*)"]
    end
    Clerk[("Clerk<br/>(hosted auth)")]
    DB[("PostgreSQL<br/>via Prisma")]

    User -->|interacts| MW
    MW -->|public| Pages
    MW -->|protect authoring routes| API
    Pages -->|fetch /api/...| API
    Pages <-->|sign-in / session| Clerk
    API -->|auth&#40;&#41; / currentUser&#40;&#41;| Clerk
    API -->|getOrCreateUser + CRUD prompts| DB
```

**Request flow for a prompt action:**

```mermaid
sequenceDiagram
    participant C as Client Component
    participant R as Route Handler (app/api)
    participant P as Prisma Client
    participant DB as PostgreSQL

    C->>R: fetch('/api/prompt/new', POST { prompt, tag })
    R->>R: auth() → clerkId (401 if missing)
    R->>R: getOrCreateUser() (Clerk currentUser → Postgres User)
    R->>P: prisma.prompt.create({ data: { creatorId, prompt, tag } })
    P->>DB: INSERT
    DB-->>P: row
    P-->>R: saved prompt
    R-->>C: 201 Created (JSON)
```

**Key architectural notes:**

- **Authentication is handled by Clerk.** `middleware.js` runs `clerkMiddleware` and protects only the authoring routes (`/create-prompt`, `/update-prompt`, `/profile`, and the current-user APIs); browsing the feed and viewing other profiles stays public.
- **Users are provisioned server-side** via `utils/user.js` (`getOrCreateUser`), which maps the Clerk session (`currentUser()`) to a PostgreSQL `User` row keyed by `clerkId`. Prompts reference that row's `id` as `creatorId`, and queries use Prisma's `include: { creator: true }` to embed author details.
- **`utils/prisma.js`** exports a singleton `PrismaClient`, cached on `globalThis` in development so hot reloads don't exhaust the connection pool.
- **`prisma/schema.prisma`** defines the `User` and `Prompt` models; migrations live in `prisma/migrations/` and are applied with `prisma migrate deploy` (run automatically on container start).
- **Next.js 15 async APIs:** dynamic route `params` are awaited in Route Handlers, and the `/profile/[id]` page unwraps `params` with React's `use()`.
- **Path alias `@*`** (configured in `jsconfig.json`) maps to the project root, enabling imports like `@components/Nav` and `@utils/database`.

---

## Project Structure

```
prompt-o-phobia/
├── middleware.js                  # clerkMiddleware — protects authoring routes
├── app/                          # Next.js App Router (routes + API)
│   ├── api/
│   │   ├── prompt/
│   │   │   ├── route.js           # GET all prompts
│   │   │   ├── new/route.js       # POST create prompt (Clerk-authed)
│   │   │   └── [id]/route.js      # GET / PATCH / DELETE (ownership enforced)
│   │   └── users/
│   │       ├── [id]/posts/        # GET prompts by a given user
│   │       └── me/posts/          # GET current user's prompts (Clerk-authed)
│   ├── sign-in/[[...sign-in]]/    # Clerk <SignIn /> page
│   ├── sign-up/[[...sign-up]]/    # Clerk <SignUp /> page
│   ├── create-prompt/page.jsx     # Create-prompt page
│   ├── update-prompt/page.jsx     # Edit-prompt page (Suspense-wrapped)
│   ├── profile/
│   │   ├── page.jsx               # "My profile" (own prompts, edit/delete)
│   │   ├── [id]/page.jsx          # Another user's public profile
│   │   └── loading.jsx            # Route-level loading spinner
│   ├── layout.jsx                 # Root layout (ClerkProvider + Nav)
│   └── page.jsx                   # Home page (hero + Feed)
├── components/
│   ├── Feed.jsx                   # Feed + debounced search
│   ├── Form.jsx                   # Shared create/edit form
│   ├── Nav.jsx                    # Nav + Clerk auth controls (Show/UserButton)
│   ├── Profile.jsx                # Profile prompt grid
│   └── PromptCard.jsx             # Single prompt card (copy, tag, edit/delete)
├── prisma/
│   ├── schema.prisma              # Prisma schema (User + Prompt models)
│   └── migrations/                # SQL migrations
├── utils/
│   ├── prisma.js                  # Cached PrismaClient singleton
│   └── user.js                    # getOrCreateUser (Clerk → Postgres sync)
├── Dockerfile                     # App image (Next.js + Prisma)
├── docker-compose.yml             # App + PostgreSQL services
├── styles/globals.css             # Global + Tailwind styles
├── public/assets/                 # Public icons & images
├── assets/                        # Source icons & images
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind theme (colors, fonts)
├── postcss.config.js              # PostCSS plugins
├── jsconfig.json                  # Path alias config (@* → ./*)
└── package.json
```

---

## Prerequisites

Before you begin, make sure you have:

- **Docker** + **Docker Compose** (the easiest path — runs both the app and PostgreSQL).
- *Or, for non-Docker local dev:* **Node.js** ≥ 18.18, **npm**, and a **PostgreSQL 16** instance.
- A **Clerk account and application** ([dashboard.clerk.com](https://dashboard.clerk.com/)) to obtain the publishable and secret keys. Social logins (e.g. Google) are configured in the Clerk dashboard, not in the app.

---

## Installation

### Option A — Docker (recommended)

Runs the app and PostgreSQL together. Only Clerk keys are needed in `.env.local`; the database is provisioned for you.

```bash
# 1. Clone the repository
git clone <repository-url>
cd prompt-o-phobia

# 2. Put your Clerk keys in .env.local (see Environment Variables)
#    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY

# 3. Build and start everything (app + Postgres).
#    --env-file passes the Clerk publishable key into the build.
docker compose --env-file .env.local up --build
```

The app is served at [http://localhost:3002](http://localhost:3002) (host port `3002` → container `3000`). Migrations are applied automatically on startup via `prisma migrate deploy`.

> Ports `3002` (app) and `5434` (Postgres) are used on the host to avoid clashing with other local services. Change them in `docker-compose.yml` if needed.

### Option B — Local Node.js

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Provide a DATABASE_URL in .env and your Clerk keys in .env.local
#    (start Postgres however you like, e.g. `docker compose up -d db`)

# 3. Apply the schema
npx prisma migrate deploy   # or: npx prisma migrate dev

# 4. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Clerk variables live in `.env.local`; the Prisma `DATABASE_URL` lives in `.env` (read by the Prisma CLI). See `.env.example` for a template. All `.env*.local` / `.env` files are git-ignored.

| Variable | Required | Where | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ Yes | `.env` (and the `app` service env in compose) | PostgreSQL connection string used by Prisma. In Docker this is set automatically to the `db` service. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Yes | `.env.local` | Clerk publishable key (safe for the browser). Baked into the client bundle at build time. |
| `CLERK_SECRET_KEY` | ✅ Yes | `.env.local` | Clerk secret key — **server-only, never expose in client code.** |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ⚙️ Optional | `.env.local` | Path to the sign-in page (`/sign-in`). |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ⚙️ Optional | `.env.local` | Path to the sign-up page (`/sign-up`). |

> When running with Docker, you do **not** need to set `DATABASE_URL` yourself — `docker-compose.yml` injects it pointing at the bundled Postgres. You only supply Clerk keys. Example `DATABASE_URL` for local (non-Docker) dev:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/prompt_o_phobia?schema=public"
```

---

## Development

Start the local development server with hot reloading:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) and auto-updates as you edit files. Remote profile images from `img.clerk.com` and `lh3.googleusercontent.com` are whitelisted via `images.remotePatterns` in `next.config.js`.

---

## Build

Create an optimized production build and run it:

```bash
# Build for production
npm run build

# Start the production server (after building)
npm run start
```

### Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `next dev` | Runs the app in development mode with hot reloading. |
| `build` | `next build` | Produces an optimized production build. |
| `start` | `next start` | Serves the production build (run after `build`). |
| `lint` | `next lint` | Runs Next.js' built-in ESLint checks. |

### Prisma Scripts

| Script | Command | Description |
| --- | --- | --- |
| `postinstall` | `prisma generate` | Generates the Prisma client (runs automatically after `npm install`). |
| `prisma:migrate` | `prisma migrate dev` | Creates and applies a migration in development. |
| `prisma:deploy` | `prisma migrate deploy` | Applies committed migrations (used on container start). |
| `prisma:studio` | `prisma studio` | Opens Prisma Studio to browse the database. |

---

## Testing

No automated test suite or testing framework (Jest, Vitest, Playwright, Cypress, etc.) is configured in this repository. Testing is currently **manual**. Linting is available via:

```bash
npm run lint
```

Contributions adding a test framework are welcome — see [Contributing](#contributing).

---

## Database

The app uses **PostgreSQL** accessed through **Prisma**. A single `PrismaClient` is exported from `utils/prisma.js` and cached on `globalThis` in development. The schema lives in `prisma/schema.prisma`.

### Data Model

```mermaid
erDiagram
    USER ||--o{ PROMPT : creates
    USER {
        string id PK "cuid"
        string clerkId "unique, links to Clerk"
        string email "required, unique"
        string username "required"
        string image
    }
    PROMPT {
        string id PK "cuid"
        string creatorId FK "-> User.id"
        string title "required"
        string prompt "required"
        string tag "required"
    }
```

**Entities:**

- **User** — `clerkId` (unique link to the Clerk user), `email` (required, unique), `username` (required), and `image` (avatar URL). Users are provisioned automatically from the Clerk session on their first authenticated write via `getOrCreateUser` (`utils/user.js`).
- **Prompt** — `creatorId` (relation to a `User`), `title` (required), `prompt` text (required), and `tag` (required). Queries use Prisma `include: { creator: true }` to embed author details. Deleting a user cascades to their prompts.

### Migrations & Seeding

Schema changes are managed with Prisma Migrate. Migrations are stored in `prisma/migrations/` and applied with `npx prisma migrate deploy` (run automatically when the Docker container starts). To create a new migration after editing the schema, run `npx prisma migrate dev --name <change>`. There is no seed script — create prompts through the UI after signing in.

---

## API Documentation

All endpoints are implemented as Next.js App Router Route Handlers under `app/api`. Responses are JSON (or plain-text error messages). **Authentication is handled by Clerk:** write routes call `auth()` from `@clerk/nextjs/server` to identify the user, resolve the Postgres `User`, and enforce ownership — the client never supplies a user id.

### Prompts

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/prompt` | Public | Returns all prompts, each populated with its creator. |
| `POST` | `/api/prompt/new` | Required | Creates a prompt. Body: `{ title, prompt, tag }`. The creator is resolved from the Clerk session. Returns `201`. `401` if unauthenticated. |
| `GET` | `/api/prompt/:id` | Public | Returns a single prompt (populated with creator). `404` if not found. |
| `PATCH` | `/api/prompt/:id` | Owner only | Updates a prompt's `title`, `prompt`, and `tag`. Body: `{ title, prompt, tag }`. `401`/`403` if not the creator. |
| `DELETE` | `/api/prompt/:id` | Owner only | Deletes the prompt. `401`/`403` if not the creator. |

### Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/users/:id/posts` | Public | Returns all prompts created by the given user id (with creator included). |
| `GET` | `/api/users/me/posts` | Required | Returns the signed-in user's prompts, resolved from the Clerk session. `401` if unauthenticated. |

> Auth on `/api/prompt/new` and `/api/users/me/*` is enforced both by `clerkMiddleware` (`middleware.js`) and inside the handlers; the `:id` mutation routes are guarded in-handler so public `GET`s still work.

### Example: Create a Prompt

Requests must carry the Clerk session cookie/token, so prompt creation is normally done from the signed-in app rather than raw `curl`. The body is just:

```bash
curl -X POST http://localhost:3000/api/prompt/new \
  -H "Content-Type: application/json" \
  --cookie "<clerk-session-cookie>" \
  -d '{
    "title": "Senior code reviewer",
    "prompt": "Act as a senior code reviewer and critique the following function...",
    "tag": "coding"
  }'
```

### Example: Fetch All Prompts

```bash
curl http://localhost:3000/api/prompt
```

---

## Deployment

### Docker (self-hosted)

The repository ships with a `Dockerfile` and `docker-compose.yml` that run the app and PostgreSQL together:

```bash
docker compose --env-file .env.local up --build
```

This builds the Next.js app image, starts Postgres (with a persistent `pgdata` volume), waits for it to be healthy, applies migrations (`prisma migrate deploy`), and serves the app on [http://localhost:3002](http://localhost:3002). For a managed Postgres, point the `app` service's `DATABASE_URL` at your external database and drop the `db` service.

### Vercel (app) + managed Postgres

1. Push the repository to GitHub/GitLab/Bitbucket and import it into [Vercel](https://vercel.com/new).
2. Provision a managed PostgreSQL database (e.g. Vercel Postgres, Neon, Supabase, RDS) and copy its connection string.
3. Add the environment variables from the [Environment Variables](#environment-variables) section to the Vercel project settings (`DATABASE_URL` plus your Clerk keys). Add `prisma migrate deploy` to the build step (or run it as a release task) so the schema is applied.
4. Use a **production** Clerk instance and set its production keys. Configure social connections in the Clerk dashboard.
5. Deploy — Vercel auto-detects Next.js and runs `next build`.

---

## Troubleshooting

| Issue | Likely Cause & Fix |
| --- | --- |
| **Postgres connection errors** | Check `DATABASE_URL` is correct and the database is reachable. In Docker, ensure the `db` service is healthy (`docker compose ps`). |
| **`Table does not exist` / Prisma P2021** | Migrations haven't been applied. Run `npx prisma migrate deploy` (Docker does this automatically on start). |
| **Clerk keys missing / 401s everywhere** | Run `clerk doctor`. Ensure `.env.local` has `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (re-run `clerk init` if needed). |
| **Whole app redirects to sign-in** | Check `middleware.js` — only authoring routes should be in `isProtectedRoute`. The feed (`/`) and public APIs must stay outside it. |
| **Social login (Google, etc.) not available** | Social connections are configured in the **Clerk dashboard**, not in code or env vars. |
| **Profile images not loading** | Avatars come from `img.clerk.com`/`lh3.googleusercontent.com`, whitelisted via `images.remotePatterns` in `next.config.js`. Add any new external image hosts there. |
| **`useSearchParams() should be wrapped in a suspense boundary`** | A client page using `useSearchParams` must be wrapped in `<Suspense>` (as done in `app/update-prompt/page.jsx`) under Next 15. |
| **Changes to `.env` not applied** | Restart the dev server after editing environment variables. |
| **Prisma client out of date** | Re-run `npx prisma generate` after editing `schema.prisma` (the `postinstall` hook does this on `npm install`). |

---

## Contributing

Contributions are welcome! This is an open-source project.

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`.
2. Make your changes and run `npm run lint` to keep the code clean.
3. Commit with a clear message and push your branch.
4. Open a Pull Request describing your change.

Helpful areas to contribute: adding a test framework, a Clerk webhook to keep `User` records in sync on profile changes, input validation, TypeScript migration, and pagination for the feed.

---

## License

License information not found. No `LICENSE` file or `license` field (in `package.json`) was present in the repository. Please add a license before public distribution.
