### NeuroSync — AI-Powered Contextual Knowledge Hub for Teams

**Tagline:** Your company’s collective brain, searchable like Google, smart like ChatGPT.

> **Goal:** Build an entirely cost‑free / open‑source friendly version of NeuroSync that ingests uploaded documents and internal knowledge sources; indexes them for semantic search; and offers AI Q&A powered by free/open models and open-source tooling.

---

## Table of Contents

1. [Why NeuroSync?](#why-neurosync)
2. [Key features](#key-features)
3. [Architecture & Component mapping (cost‑free)](#architecture--component-mapping-cost-free)
4. [Tech stack (cost‑free choices)](#tech-stack-cost-free-choices)
5. [Getting started (local / cost‑free)](#getting-started-local--cost-free)
6. [Environment variables](#environment-variables)
7. [Sync connectors & data sources](#sync-connectors--data-sources)
8. [Semantic search & AI Q&A strategy](#semantic-search--ai-qa-strategy)
9. [Security & multi-tenancy (JWT)](#security--multi-tenancy-jwt)
10. [Scaling notes (self-hosted)](#scaling-notes-self-hosted)
11. [Development roadmap & issues to solve](#development-roadmap--issues-to-solve)
12. [Contributing](#contributing)
13. [License](#license)

---

## Why NeuroSync?

Teams waste hours answering the same questions. NeuroSync turns your company chatter, docs, code and emails into a single searchable knowledge graph with semantic search and AI-powered answers — but built only with cost‑free and open-source components so it can be run on inexpensive infra (or your laptop) without vendor lock-in.

---

## Key features

* File uploads for ingestion (PDF, Markdown, Office files, plain text).
* Text extraction & normalization.
* Vector indexing & semantic/full-text search.
* Contextual Q&A endpoint (chat-style) using open models / local LLMs or Hugging Face transformers.
* Multi-tenant JWT auth and role-based access control (RBAC).
* Caching layer for hot queries (Redis).
* Real-time update notifications via WebSockets (Socket.IO).
* Admin UI to view health, usage, and search logs.

---

## Architecture & Component mapping (cost‑free)

```
Sources (Uploads)
        │
        ▼
Sync workers (Node.js) → Queue (Redis/Bull) → Normalizer (text extraction)
        │
        ▼
Vectorizer (python sentence‑transformers) → Vector DB (Postgres + pgvector) + full‑text index
        │
        ▼
API Server (Node.js + Express)
  ├─ /search (semantic + keyword) → Postgres+pgvector
  ├─ /qa (chat) → Local LLM or HF inference
  ├─ /auth (JWT + OAuth)
  └─ WebSocket (Socket.IO) for realtime updates

Cache: Redis
Event Bus: NATS / RabbitMQ (optional, free self-hosted) or use Redis streams
Monitoring: Prometheus + Grafana (optional)
```

**Notes:** All components can be self-hosted locally or on any VPS. No paid SaaS required.

---

## Tech stack (cost‑free choices)

Below is the cost‑free mapping of the originally proposed stack:

| Role | Original idea | Cost‑free alternative (recommended) |
| --- | ---: | --- |
| Backend | Node.js + Express | Node.js + Express (same) — free |
| Primary DB / Index | MongoDB Atlas Search | PostgreSQL + pgvector (free + widely supported) or self‑hosted MongoDB + FAISS |
| Vector DB / Semantic Search | (paid) | Postgres + pgvector or FAISS (python) or Milvus (self-hosted) |
| Embeddings & LLM | OpenAI / LangChain | sentence-transformers (Hugging Face) for embeddings; Hugging Face Transformers / local LLMs via llama.cpp, text-generation-webui, or Ollama (community) for QA; LangChain (open‑source) can still orchestrate |
| Caching | Redis (self-hosted) | Redis (self-hosted) — free |
| Event Bus | Kafka | NATS or RabbitMQ or Redis Streams (all free to self-host) |
| Auth | JWT | jsonwebtoken for JWT (free libs) |
| Real-time | WebSockets | Socket.IO (free) |
| Sync workers | Background jobs with BullMQ | BullMQ (uses Redis) or simple worker processes — free |
| File previews / parsers | Commercial OCR | Tesseract OCR + libreoffice headless for doc extraction (free) |

---

## Getting started (local / cost‑free)

This repository has a dev-first setup using Docker and Docker Compose. The `docker-compose.yml` brings up Postgres (with pgvector), Redis, and a small gateway.

### Prerequisites

* Docker & Docker Compose
* Node.js (v18+)
* Python (3.9+) — for vectorizer worker (optional)
* Git

### Quick start (dev)

1. Clone the repo

```bash
git clone https://github.com/your-username/neurosync.git
cd neurosync
```

2. Copy env file

```bash
cp .env.example .env
# Edit .env to set your local secrets (no paid keys required)
```

3. Start stack

```bash
docker compose up --build
```

This will start:

* `postgres` (with pgvector)
* `redis`
* `neurosync-api` (Node.js)

4. Install server dependencies (if you're running outside Docker)

```bash
cd backend
npm install
```

5. Run migrations & create DB extensions
   If using dockerized Postgres image that includes `pgvector`, run the SQL setup (provided in `backend/scripts/db-setup.sql`). Then seed a local user.

```bash
psql postgresql://postgres:postgres@localhost:5432/neurosync -f backend/scripts/db-setup.sql
node backend/scripts/seed-dev.js
```

6. Start local dev server

```bash
cd backend
npm run dev
```

Open `http://localhost:4000` to see a minimal admin UI / health check.

---

## Environment variables (.env.example)

```
# App
PORT=4000
NODE_ENV=development
JWT_SECRET=devsecret
TENANT_DEFAULT=local

# Postgres
PGHOST=postgres
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=neurosync
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/neurosync

# Redis (caching + queue)
REDIS_URL=redis://redis:6379

# (External connectors are not included in this build)

# Hugging Face / Local model config (optional, cost-free defaults below)
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2  # local HF model for embeddings
LLM_MODE=local  # options: local, hf-inference, openai (openai not cost-free)
LOCAL_LLM_PATH=./models/your-local-llm
```

> **Important:** For a fully cost‑free setup, don't set any paid provider keys (OpenAI). The system defaults to sentence‑transformers for embeddings and tries to use a local model for the LLM. If you want better QA quality later you can add an OpenAI key — optional.

---

## Data ingestion

This build focuses on file uploads. External connectors (Slack, Notion, Drive, GitHub, etc.) are intentionally excluded.

---

## Current implementation status (repo)

- Backend API (`backend/`): Express app with routes
  - `/health` (OK)
  - `/api/auth/login`, `/api/auth/refresh` (mocked JWT issuance)
  - `/api/files/upload` (uploads to S3/MinIO)
  - `/api/search` (placeholder response)
  - `/api/ask` (placeholder response)
  - `/api/admin/metrics` (basic OK)
- Swagger UI at `/api/docs` (skeleton)
- Database: PostgreSQL + Prisma schema present; pgvector enabled via script; retrieval not wired yet
- Redis: configured in env and compose; queues/workers not implemented yet
- Workers: placeholders only (no running worker service yet)
- Open models: envs prepared; local embeddings/LLM integration not yet implemented

---

## Semantic search & AI Q&A strategy

1. **Embeddings pipeline** (cost‑free):

   * Use `sentence-transformers` (Hugging Face) locally or via Transformers to compute embeddings.
   * Store embeddings in `pgvector` columns in Postgres.
2. **Search**:

   * For semantic search, query nearest neighbors in `pgvector` plus a full-text filter (Postgres `tsvector`) for hybrid results.
3. **Context building for QA**:

   * Retrieve top‑k semantic neighbors, assemble context, and pass to a local model or HF transformer for generation.
4. **LLM / generator** (cost‑free options):

   * **Local LLMs:** llama.cpp, GPT4All, Mistral/LLama2 derivatives (requires model files & resources)
   * **Hugging Face Hub:** run `transformers` locally (CPU/GPU) — free but resource dependent
   * **Fallback:** If you have no local LLM, provide extractive answers from the top documents (safe default)

**Note:** Using local LLMs may require significant CPU/RAM; for small teams, the extractive + concise summarization approach (no generation) is a cost‑free high‑quality fallback.

---

## Security & multi-tenancy (JWT)

* Authentication: OAuth2 for connectors, local user accounts for admin. Use `jsonwebtoken` to mint access tokens.
* Multi-tenant: include `tenant_id` claim in JWT; database row-level tenant filtering.
* RBAC: roles `admin`, `editor`, `reader`.
* Secrets: store locally in `.env` or use a self-hosted secret store.

---

## Scaling notes (self-hosted / cost‑free)

* Use Postgres with connection pool tuning; move vector search to a dedicated node if needed.
* Replace Redis with Redis Cluster as you grow (self-hosted). Redis Streams can act as event bus if NATS/RabbitMQ is not used.
* If LLM generation is too heavy, switch to a microservice that runs on a GPU machine (spot or rented) and keep inference stateless.

---

## Development roadmap & issues to solve

1. Core MVP

   * Ingest pipeline for uploads
   * Postgres + pgvector indexing
   * Basic semantic search API
   * JWT auth and admin health UI
2. Ingestion & parsing

   * File parsing (pdf, docx, pptx) using `pdfminer` / `textract` / LibreOffice
3. QA

   * Implement context assembly and local LLM integration
   * Implement extractive fallback
4. UX

   * Admin UI for usage, health, and logs
   * CLI tools to manage local models and DB
5. Hardening

   * Row-level security for tenants
   * Rate limiting & CORS

---

## Contributing

Contributions welcome! Suggested workflow:

1. Fork repo
2. Create feature branch
3. Add tests and docs
4. Open a PR and describe the change

Please adhere to the project style: ESLint, Prettier, and a clear commit message format.

---

## License

MIT — free to use and adapt.

---

## Final notes (cost‑free philosophy)

* This README is intentionally conservative: it chooses stable, well-supported, open‑source components that can be run without vendor costs.
* You will trade off convenience and inference quality (compared to paid APIs) for total freedom and no recurring costs. Start small: semantic search + extractive answers gives excellent ROI before adding heavy local LLM inference.

---

If you want, I can also scaffold a `docker-compose.yml`, example connector for Slack, or the Postgres schema + DB setup script next. Which of those should I generate first?
