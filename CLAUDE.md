# Ticket Management System

AI-powered support ticket management system for classifying, responding to, and routing support tickets.

## Tech Stack

- **Runtime / Package Manager**: Bun (fallback: Node.js 21 + npx tsx)
- **Frontend**: React 19 + Vite 6 + TypeScript (`/client`)
- **Backend**: Express 5 + TypeScript (`/server`)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Better Auth (`better-auth`) — email/password, database-backed sessions via Prisma
- **AI**: Anthropic Claude API (classification, summaries, suggested replies)
- **Knowledge Base**: pgvector (embeddings stored in PostgreSQL)
- **Email**: Nodemailer (outbound), webhook (inbound)

## Project Structure

```
ticket-management-system/
├── client/           # React + Vite frontend (port 5173)
│   ├── src/
│   │   ├── main.tsx
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── index.html
└── server/           # Express API (port 3000)
    └── src/
        └── index.ts
```

## Dev Commands

```bash
# Install dependencies
bun install          # or: npm install

# Run both apps
bun run dev          # or run separately:

# Server only (hot reload)
cd server && bun --watch src/index.ts
# or with Node: npx tsx src/index.ts

# Client only
cd client && bun run dev
# or with Node: npx vite
```

## Ports

| Service | URL |
|---------|-----|
| React (Vite) | http://localhost:5173 |
| Express API  | http://localhost:3000 |

Vite proxies `/api/*` → `http://localhost:3000` in development.

## Domain Model

**Ticket statuses**: `open` → `resolved` → `closed`

**Ticket categories**: `general_question`, `technical_question`, `refund_request`

**User roles**:
- `admin` — seeded on first deploy; manages agents and settings
- `agent` — created by admin; handles tickets

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ticket_management
SESSION_SECRET=change-me-in-production
ANTHROPIC_API_KEY=
```

## Authentication

### Stack & Libraries

Auth is handled entirely by **Better Auth** (`better-auth` package) — not express-session directly.

| Layer | Library | Location |
|-------|---------|----------|
| Server config | `better-auth` + `prismaAdapter` | `server/src/lib/auth.ts` |
| Express handler | `toNodeHandler(auth)` | `server/src/index.ts` |
| Session validation | `auth.api.getSession()` | `server/src/lib/require-auth.ts` |
| Client | `createAuthClient` from `better-auth/react` | `client/src/lib/auth-client.ts` |

Sign-up is **disabled** (`disableSignUp: true`). Only pre-created accounts (seeded `admin`, admin-created `agents`) can sign in.

Trusted origins are read from the `TRUSTED_ORIGINS` env var (comma-separated). Add `http://localhost:5173` in development.

---

### Auth Flow

```
Client                          Server
  │                               │
  ├─ authClient.signIn.email() ──►│ POST /api/auth/sign-in/email
  │                               │  Better Auth validates credentials,
  │                               │  creates session in DB, sets cookie
  │◄─────────────── Set-Cookie ───┤
  │                               │
  ├─ (any protected API call) ───►│ requireAuth middleware
  │   cookie sent automatically   │  auth.api.getSession(headers)
  │                               │  attaches req.user + req.session
  │◄─────────────── response ─────┤
  │                               │
  ├─ authClient.signOut() ────────►│ POST /api/auth/sign-out
  │                               │  deletes session from DB
  │◄─────────────── clears cookie ┤
```

All auth routes are mounted at `/api/auth/*` and handled by `toNodeHandler(auth)` before any other middleware.

---

### Client Usage

```ts
import { authClient } from "@/lib/auth-client";

// Sign in
const { error } = await authClient.signIn.email({ email, password });

// Sign out
await authClient.signOut();

// Reactive session (React hook)
const { data: session, isPending } = authClient.useSession();
// session.user  → { id, name, email, role, ... }
// session.session → { id, expiresAt, ... }
```

`authClient.useSession()` is used in `App.tsx` inside `ProtectedRoute` to gate all authenticated pages. While `isPending` is true, a loading spinner is shown. If no session exists, the user is redirected to `/login`.

The `authClient` base URL is hardcoded to `http://localhost:3000` — update `client/src/lib/auth-client.ts` when deploying.

---

### Server-Side Route Protection

Apply `requireAuth` as middleware to any route that needs an authenticated user:

```ts
import { requireAuth } from "./lib/require-auth";

// Single route
app.get("/api/tickets", requireAuth, handler);

// Router group
router.use(requireAuth);
```

`requireAuth` calls `auth.api.getSession()` with the request headers (reads the session cookie), returns `401` if no valid session exists, and otherwise attaches the user to the request:

```ts
req.user    // Better Auth User object
req.session // Better Auth Session object
```

TypeScript augmentation for `req.user` and `req.session` is declared in `server/src/types/express.d.ts` (or similar — check if this file exists before adding it again).

---

## Documentation

Always use **Context7 MCP** to fetch current documentation before working with any library in this project. This includes Express, Prisma, Vite, React, Anthropic SDK, and Bun.

Steps:
1. Call `mcp__context7__resolve-library-id` with the library name
2. Call `mcp__context7__query-docs` with the resolved ID and your specific question
3. Answer based on the fetched docs — do not rely on training data alone

Libraries to always look up via Context7:
- `Bun` — runtime APIs, workspace commands
- `Express` — middleware, routing, error handling
- `Prisma` — schema syntax, migrations, queries
- `Vite` — config, plugins, proxy
- `React` — hooks, patterns
- `Anthropic` / `Claude API` — model IDs, tool use, streaming
