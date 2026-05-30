# Ticket Management System

AI-powered support ticket management system for classifying, responding to, and routing support tickets.

## Tech Stack

- **Runtime / Package Manager**: Bun (fallback: Node.js 21 + npx tsx)
- **Frontend**: React 19 + Vite 6 + TypeScript (`/client`)
- **Backend**: Express 5 + TypeScript (`/server`)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: express-session + connect-pg-simple (database-backed sessions)
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
