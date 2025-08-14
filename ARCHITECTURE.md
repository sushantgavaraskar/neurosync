## NeuroSync Architecture, Functionality, and Frontend Integration

This document explains the overall system design, backend components, data flow, and how a frontend integrates with the NeuroSync API. It reflects the current implementation in this repository.

---

### Goals

- Cost-free/open-source friendly stack
- Multi-tenant workspaces and JWT-based auth
- Ingestion, chunking, embeddings, semantic search (pgvector)
- Optional LLM Q&A when `OPENAI_API_KEY` is provided; cost-free fallback otherwise
- Queues/workers for background processing

---

## High-level architecture

```mermaid
flowchart LR
  subgraph Sources
    U[Uploads]
  end

  U --> API

  subgraph Backend
    API[API Server (Express)]
    Q[Redis + BullMQ]
    WK[Embedding Worker]
    DB[(Postgres + pgvector)]
    OBJ[(S3/MinIO)]
  end

  API -- Uploads --> OBJ
  API -- Index Request --> Q
  Q --> WK
  WK --> DB
  API -- Search & Auth --> DB
  API -- Q&A --> LLM{{OpenAI (optional)}}
```

---

## Components

- API Server (`backend/app.js`, `backend/server.js`)
  - Express app with routes for auth, files, search, ask, and admin
  - Swagger UI stub at `/api/docs`
- Database: Postgres + `vector` extension (`backend/scripts/db-setup.sql`)
  - Tables: `workspaces`, `users`, `documents`, `document_embeddings`
  - Nearest-neighbor search via `embedding <=> $query_vector`
- Cache/Queue: Redis + BullMQ (`backend/config/redis.js`)
  - Queue name constants in `backend/queues/names.js`
  - Embedding jobs consumed by `backend/workers/embedding.worker.js`
- Object Storage: S3/MinIO (`backend/config/s3.js`)
  - Used by uploads; optional for local-only dev
- Embeddings: Local HF pipeline (`@xenova/transformers`) (`backend/services/embedding.service.js`)
  - Default model: `Xenova/all-MiniLM-L6-v2` (384 dims)
- LLM Q&A: `openai` SDK (optional) (`backend/routes/qa.routes.js`)
  - If `OPENAI_API_KEY` is not set, endpoint returns a cost-free placeholder answer

---

## Data model (current)

- `workspaces`
  - `id`, `name`
- `users`
  - `id`, `email` (unique), `password_hash`, `role`, `workspace_id`
- `documents`
  - `id`, `workspace_id`, `source_type`, `source_id`, `title`, `text`, `metadata`, `created_at`
- `document_embeddings`
  - `id`, `document_id`, `workspace_id`, `chunk_index`, `embedding vector(384)`, `text`, `metadata`, `created_at`

Note: `vector(384)` aligns with `all-MiniLM-L6-v2`. If you change the embedding model, update dimension accordingly.

---

## Backend flows

### Authentication (JWT)

1) POST `/api/auth/login` with `{ email, password }`
2) On success returns `{ accessToken, refreshToken }`
3) Attach `Authorization: Bearer <accessToken>` to protected routes
4) Refresh via POST `/api/auth/refresh` with `{ refreshToken }`

### Ingestion and indexing (uploads)

1) Client uploads a file to `POST /api/files/upload` (multipart/form-data, field `file`) with Bearer token
2) API writes the object to S3/MinIO and records a `documents` row
3) Indexer (`backend/services/indexer.service.js`) chunks text and enqueues embedding jobs to Redis
4) Embedding worker consumes jobs, computes vectors via `@xenova/transformers`, and upserts into `document_embeddings`

### Semantic search (pgvector with fallback)

1) Client calls `GET /api/search?q=...`
2) Service embeds the query locally and attempts vector NN search with `embedding <=> :query_vector`
3) If `document_embeddings` is empty or `vector` is not available, falls back to `ILIKE` text search
4) Returns `{ query, results: [{ id, text, metadata, score }] }`

### Q&A (optional OpenAI)

1) Client calls `POST /api/ask` with `{ query }` and Bearer token
2) If `OPENAI_API_KEY` is set, uses `openai` chat completion to produce an answer
3) Otherwise returns a cost-free placeholder answer

---

## Environment variables

Required
- `JWT_SECRET` – for JWT signing

Postgres
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
- Optional: `DATABASE_URL` (reserved for future ORM integration)

Redis
- `REDIS_URL` – e.g., `redis://localhost:6379`

Object storage (optional for uploads)
- `S3_ENDPOINT` – e.g., `http://localhost:9000` (MinIO)
- `S3_REGION` – e.g., `us-east-1`
- `S3_BUCKET`
- `S3_ACCESS_KEY`, `S3_SECRET_KEY`

Embeddings & LLM
- `EMBEDDING_MODEL` – default `Xenova/all-MiniLM-L6-v2`
- `OPENAI_API_KEY` – optional; enables real LLM answers in `/api/ask`

---

## Frontend integration

Below are simple patterns using Fetch; any SPA (React/Vue/Svelte) can use the same HTTP interface.

### Login and token handling

```ts
// Login
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { accessToken, refreshToken } = await res.json();

// Store accessToken in memory (e.g., context/state) and refreshToken securely (httpOnly cookie recommended if handled server-side)
```

### File upload

```ts
const form = new FormData();
form.append('file', file); // from <input type=file>

const up = await fetch('/api/files/upload', {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
  body: form,
});
const { key, documentId } = await up.json();
```

### Search

```ts
const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
  headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
});
const { results } = await res.json();
```

### Ask (Q&A)

```ts
const res = await fetch('/api/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  },
  body: JSON.stringify({ query })
});
const { answer, sources } = await res.json();
```

---

## Running locally (quick)

1) Start Postgres (pgvector) and Redis (Docker):
```
docker run -d --name ns-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=neurosync -p 5432:5432 pgvector/pgvector:pg16
docker run -d --name ns-redis -p 6379:6379 redis:7-alpine
```

2) Setup DB and seed:
```
psql postgresql://postgres:postgres@localhost:5432/neurosync -f backend/scripts/db-setup.sql
node backend/scripts/seed-dev.js
```

3) Start API and worker:
```
cd backend && npm install
npm run dev
node backend/workers/embedding.worker.js
```

4) Health check: `http://localhost:4000/health`

---

## Deployment notes

- Use Docker Compose to run Postgres+pgvector, Redis, and the API
- MinIO can provide S3-compatible object storage locally or on a VPS
- For scale: consider Redis Cluster and a dedicated Postgres node for vector-heavy queries

---

## Roadmap (selected)

- Add connectors (Slack, GitHub, Notion, Drive, IMAP)
- Expand indexer: robust chunking, deduplication, metadata filters
- Hybrid retrieval: combine BM25 (tsvector) with pgvector for better ranking
- RAG: context assembly + LLM prompt management with citations
- RBAC and admin UI for connector management and sync logs


