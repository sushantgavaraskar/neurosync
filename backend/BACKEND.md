# NeuroSync Backend Architecture and Integration Guide

## Goals and constraints
- Multi-tenant: workspace isolation and quotas
- Near–real-time ingestion from external sources
- Semantic search + RAG with provenance
- Cost-aware (caching, batching)
- Secure (OAuth token encryption, audit logs)

## Services (logical)
- API/Auth (JWT issuance, tenant resolution, rate limiting)
- Connectors/Ingest workers (normalize, dedupe, push events)
- Event bus (Kafka, optional for MVP use BullMQ)
- Indexing (chunking, persistence, indexing)
- Embedding (batch calls + caching)
- Search (hybrid retrieval)
- AI Orchestrator (RAG, provenance)
- Realtime/Notifications (WebSocket)
- Cache & Quota (Redis)
- Admin & Monitoring
- Storage & DB (Postgres, S3, optional vector DB)

## Current implementation status
- Express app skeleton with routes/controllers
- Prisma schema for `Workspace`, `User`, `Document`, `QueryLog`
- S3 client setup
- Upload/search/ask/auth endpoints scaffolded

## Folder structure (flattened under `backend/`)
- `server.js` – server entry
- `app.js` – Express app
- `config/` – env, Prisma, S3
- `routes/` – auth, files, search, qa, admin
- `controllers/` – handlers
- `services/` – domain logic (placeholders)
- `middlewares/` – auth/upload/error
- `utils/` – helpers
- `workers/` – background workers (placeholders)
- `docs/` – OpenAPI
- `prisma/schema.prisma` – DB models

## Environment
```
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neurosync
JWT_SECRET=dev-secret
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=neurosync
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
OPENAI_API_KEY=
```

## Data model (Prisma excerpt)
- `Workspace { id, name, tenantPlan, settings }`
- `User { id, email, passwordHash, role, workspaceId }`
- `Document { id, workspaceId, sourceType, sourceId, text, metadata, status }`
- `QueryLog { id, workspaceId, userId, queryText, retrievedSources, response }`

## API surface
- `POST /api/auth/login` → returns `{ accessToken, refreshToken }`
- `POST /api/auth/refresh`
- `POST /api/files/upload` (multipart: `file`)
- `GET  /api/search?q=` → `{ results: [] }`
- `POST /api/ask` → `{ answer, sources }`
- `GET  /api/admin/metrics`
- `GET  /api/docs` (Swagger)

## Ingestion flow (planned)
1) Connector normalizes event → publish to queue (Kafka/BullMQ)
2) Indexer chunks text, dedupes, persists, enqueues embedding
3) Embedding worker batches requests and stores vectors
4) Indexer marks documents ready, updates search index

## Query + RAG flow (planned)
1) `/ask` → validate JWT/workspace
2) Search: BM25 + vector ANN → top chunks
3) Orchestrator builds prompt, budgets tokens, calls LLM
4) Return answer with citations; log query

## Frontend integration
- Auth: store `accessToken` (JWT). Attach header `Authorization: Bearer <token>`
- Upload:
  - `POST /api/v1/files/upload`
  - FormData: `file`
- Search:
  - `GET /api/v1/search?q=hello` → show hits
- Ask:
  - `POST /api/v1/ask` with `{ query, topK? }`
- Status/Docs: `/health`, `/api/docs`

### Example fetch (React)
```js
// login
const res = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { accessToken } = await res.json();

// search
const searchRes = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`, {
  headers: { Authorization: `Bearer ${accessToken}` }
});
const data = await searchRes.json();
```

## Running locally
```
cd backend
npm install
npm run db:generate
npm run dev
# http://localhost:4000/health
```

## Deployment (high level)
- Containerize with Docker
- Postgres (managed), S3 (managed), Redis (managed)
- CI/CD with GitHub Actions
- Scale stateless pods horizontally

## Roadmap
- Add Redis + BullMQ workers
- Add hybrid search (Atlas Search/pgvector + embeddings)
- Add provenance + citations
- OAuth connectors (Slack/Drive/Notion/GitHub)
- RBAC and quotas


