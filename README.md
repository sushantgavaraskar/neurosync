## NeuroSync

A personal knowledge vault that lets you ingest content (notes, PDFs, docs), index it, and query it with semantic search and retrieval‑augmented generation (RAG). Designed for multi‑tenant workspaces, provenance, and cost‑aware operations.

### Key features

- **Ingestion**: upload files; planned connectors (Slack, Drive, Notion, GitHub)
- **Semantic search**: hybrid retrieval (planned) and embeddings‑based relevance
- **RAG answers**: grounded responses with citations/provenance (planned)
- **Multi‑tenant**: workspace isolation and (future) quotas
- **Security**: JWT auth, env‑based secrets, S3/MinIO for objects
- **Observability**: health checks; metrics/logging planned

### Tech overview

- **Backend**: Node.js, Express, PostgreSQL (Prisma), S3/MinIO, Redis (planned), OpenAI + LangChain (planned)
- **Frontend**: Any SPA or server framework (REST integration). Frontend specifics are out of scope here.

### Project structure (top‑level)

- `backend/` – application backend (Express, Prisma, config)
- `server/` – reserved for future use

For backend architecture, data models, and integration details, see `backend/BACKEND.md`.
The REST base path uses `/api` (no version prefix).

## Getting started (development)

### Prerequisites
- Node.js 18+
- PostgreSQL (local or remote)
- Optional: Redis, MinIO

### 1) Configure environment
```bash
cd backend
# Ensure .env exists and values match your local setup
```

Default `.env` keys used by the backend:
- `PORT`, `NODE_ENV`
- `DATABASE_URL` (PostgreSQL connection)
- `JWT_SECRET`
- `REDIS_URL` (optional now)
- `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`
- `OPENAI_API_KEY` (for embeddings/RAG when enabled)

### 2) Install and prepare DB client
```bash
cd backend
npm install
npm run db:generate
# optional (requires Postgres): npm run db:migrate
```

### 3) Run the backend
```bash
cd backend
npm run dev
# Health check: http://localhost:4000/health
```

## Development notes
- Code is organized at the root of `backend/` (no `src/`), per project preference
- Prisma schema lives at `backend/prisma/schema.prisma`
- Swagger UI scaffolded at `/api/docs` (route mounted when server runs)
- Detailed backend architecture, flows, and frontend integration guidance live in `backend/BACKEND.md`

## Roadmap (high level)
- Add Redis + BullMQ for background jobs
- Add hybrid search and embeddings index
- Add provenance and citations in RAG responses
- Add OAuth connectors (Slack/Drive/Notion/GitHub)
- Add RBAC, quotas, and admin dashboards

## License
MIT
