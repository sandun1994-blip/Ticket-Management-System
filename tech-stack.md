# Tech Stack

## Frontend
- **React** — UI and dashboard
- **Vite** — development server and build tool

## Backend
- **Node.js + Express** — REST API server

## Database
- **PostgreSQL** — primary database for tickets, users, and sessions
- **Prisma** — ORM for schema management and type-safe queries

## Authentication
- **express-session** — server-side session management
- **connect-pg-simple** — stores sessions in PostgreSQL (no separate session store needed)

## AI
- **Anthropic Claude API** — ticket classification, summaries, and suggested replies
- **pgvector** — knowledge base embeddings stored in PostgreSQL for RAG

## Email
- **Nodemailer** — sending outbound responses to users
