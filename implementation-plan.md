# Implementation Plan

## Phase 1 — Project Setup

- [ ] Initialize monorepo structure (`/client`, `/server`)
- [ ] Set up Express server with TypeScript
- [ ] Set up React + Vite frontend with TypeScript 
- [ ] Configure PostgreSQL database
- [ ] Set up Prisma with initial schema (users, tickets)
- [ ] Configure environment variables (`.env`)
- [ ] Set up `connect-pg-simple` session table in Prisma schema

---

## Phase 2 — Authentication

- [ ] Configure `express-session` + `connect-pg-simple` middleware
- [ ] `POST /auth/login` — validate credentials, create session
- [ ] `POST /auth/logout` — destroy session
- [ ] `GET /auth/me` — return current session user
- [ ] Auth middleware to protect routes
- [ ] Seed script to create the default admin user
- [ ] Frontend: Login page
- [ ] Frontend: Auth context + protected route wrapper

---

## Phase 3 — Ticket Core

- [ ] Prisma schema: tickets (id, subject, body, status, category, createdAt, assignedTo)
- [ ] `POST /tickets` — create a ticket
- [ ] `GET /tickets` — list tickets with filtering (status, category) and sorting
- [ ] `GET /tickets/:id` — ticket detail
- [ ] `PATCH /tickets/:id` — update status or category
- [ ] Frontend: Ticket list page with filter/sort controls
- [ ] Frontend: Ticket detail page
- [ ] Frontend: Create ticket form

---

## Phase 4 — User Management (Admin)

- [ ] `GET /users` — list all agents (admin only)
- [ ] `POST /users` — admin creates a new agent account
- [ ] `DELETE /users/:id` — admin deactivates an agent
- [ ] Role-based middleware (admin vs agent checks)
- [ ] Frontend: User management page (admin only)
- [ ] Frontend: Create agent form

---

## Phase 5 — Dashboard

- [ ] `GET /dashboard/stats` — ticket counts by status and category
- [ ] Frontend: Dashboard page with stat cards
- [ ] Frontend: Recent tickets widget

---

## Phase 6 — AI Features

- [ ] Integrate Anthropic Claude API (`/server/lib/claude.ts`)
- [ ] `POST /tickets/:id/classify` — AI assigns a category to the ticket
- [ ] Auto-classify ticket on creation
- [ ] `GET /tickets/:id/summary` — AI generates a short summary
- [ ] `GET /tickets/:id/suggested-reply` — AI drafts a reply using knowledge base
- [ ] Set up `pgvector` extension in PostgreSQL
- [ ] Prisma schema: knowledge base entries with embedding column
- [ ] Admin: upload/manage knowledge base documents
- [ ] RAG pipeline: embed docs on upload, retrieve on reply generation
- [ ] Frontend: Show AI summary on ticket detail
- [ ] Frontend: Show suggested reply with accept/edit/discard actions

---

## Phase 7 — Email Integration

- [ ] Inbound: webhook endpoint `POST /email/inbound` to receive parsed emails
- [ ] Auto-create ticket from inbound email payload
- [ ] Link reply email address to ticket for threading
- [ ] Outbound: Nodemailer setup (`/server/lib/mailer.ts`)
- [ ] `POST /tickets/:id/reply` — send response and mark ticket resolved
- [ ] Frontend: Reply composer on ticket detail page

---

## Phase 8 — Polish

- [ ] Global error handling middleware (Express)
- [ ] Input validation on all API routes
- [ ] Loading and empty states on all frontend pages
- [ ] Consistent toast notifications for actions
- [ ] Responsive layout check
