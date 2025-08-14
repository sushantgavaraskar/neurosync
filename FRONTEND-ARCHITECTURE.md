### NeuroSync Frontend Architecture and UI Spec (Builder.io-ready)

This document maps the current backend to a complete, production-grade frontend architecture, with page-level specs, components, and API contracts. It also flags backend gaps so the UI can plan around them.

---

## 1) Backend status snapshot (as of repo scan)

- Auth
  - POST `/api/auth/login` → issues JWT access/refresh using `zod` validation and Postgres users.
  - POST `/api/auth/refresh` → accepts refresh token, returns new access token.
  - Middleware: `requireAuth`/`optionalAuth` decodes JWT and sets `req.user`.
- Search
  - GET `/api/search?q=...` → returns `{ query, results }` where each result currently is `{ id, text, metadata, score }` (no `title` or `excerpt`).
  - Uses `pgvector` if available, falls back to `ILIKE` query.
- Ask (Q&A)
  - POST `/api/ask` → requires auth; if no OpenAI key, returns a stub response: `{ query, answer: 'LLM not configured (cost-free mode)', sources: [] }`.
- Files
  - POST `/api/files/upload` → requires auth; streams to S3-compatible store then enqueues embedding for the uploaded doc; returns `{ key, documentId }`.
- Admin
  - GET `/api/admin/metrics` → returns `{ ok: true }` placeholder only.
- Health
  - GET `/health` → `{ status: 'ok' }`.

Known gaps / inconsistencies to plan for in UI:
- Duplicate/merge-conflicted route files:
  - `backend/routes/search.routes.js`, `backend/routes/qa.routes.js`, `backend/routes/files.routes.js` each contain two implementations (inline + controller-based) and multiple `export default` statements.
  - `controllers` referenced do not exist: `controllers/search.controller.js`, `controllers/qa.controller.js`, `controllers/files.controller.js`.
- `backend/server.js` is duplicated and references a missing `middlewares/error.middleware.js`.
- Search response shape doesn’t match the richer shape the client currently expects (no `title`, `excerpt`, `sourceType`).
- Admin metrics are placeholder only (UI should handle empty/defaults).
- S3 config must be set or uploads will fail. In cost‑free mode, consider minio/localstack or disable uploads.

Recommended minimal backend fixes (non-blocking for UI spec):
- Remove duplicate code in the affected route files; pick either inline or controller style.
- Create the missing controllers or keep inline handlers and delete controller imports.
- Add `error.middleware.js` or remove usage in `server.js`.
- Expand `/api/admin/metrics` to return basic counts.
- Normalize search result shape: include `title`, `excerpt`, `sourceType`, `sourceId` (or provide an adapter on the client—see below).

---

## 2) Frontend architecture

- Stack
  - SPA with Vite + React + TypeScript + Tailwind + shadcn/ui components.
  - `apiClient` handles base URL, tokens, refresh, and typed wrappers.
  - `AuthContext` provides session state and `ProtectedRoute` guards.

- Routing (SPA)
  - `/` → Landing (public)
  - `/login` → Login
  - `/dashboard` → Auth-only Overview
  - `/search` → Auth-optional search; enhanced UX when logged in (workspace-aware)
  - `/ask` → Auth-only Chat/Q&A
  - `/uploads` → Auth-only File upload & history (MVP: upload only)
  - `/admin` → Admin-only Metrics (graceful empty state until backend returns real data)
  - `*` → NotFound

- Global state
  - Auth: `AuthContext` current user, token refresh, login/logout.
  - UI: toasts/skeletons via shadcn components; optional global query cache if adopting TanStack Query later.

- Data fetching patterns
  - `apiClient` with automatic 401 refresh, adapters for response shapes, and form-data support for uploads.
  - Debounced inputs for search.

- Security & roles
  - Roles from JWT (defaulting to `member` if absent). Admin gate for `/admin`.

---

## 3) Pages and content (Builder.io friendly)

### Landing page (`/`) – built in Builder.io

Sections (in order), each a Builder section block with optional CMS fields:
- Hero
  - Fields: `headline`, `subheadline`, `primaryCTA{label,href}`, `secondaryCTA{label,href}`, `badges[]`.
  - Visual: gradient logo mark, large headline with animated gradient word, two CTAs.
- Product Highlights (3-up cards)
  - Items: Semantic Search, AI Insights, Universal Connect. Fields per card: `icon`, `title`, `description`.
- Interactive Demo (optional embed placeholder)
  - Field: `demoVideoUrl` or interactive widget placeholder text.
- Features Grid (6 cards)
  - Fields per card: `icon`, `title`, `description`.
- Integrations Grid
  - Fields: array of integrations with `name`, `logo`/`initials`.
- Pricing CTA / Calculator (optional embed)
  - Fields: `ctaTitle`, `ctaSubtitle`, `primaryCTA`, `secondaryCTA`.
- Testimonials
  - Fields: `items[]` with `quote`, `author`, `role`.
- FAQ
  - Fields: `items[]` with `question`, `answer`.
- Footer
  - Fields: columns with `heading` and `links[]`.

Navigation: Sign In → `/login`; Get Started → `/login` (or `/dashboard` if already authenticated).

### Login (`/login`)
- Components: `LoginForm` (email, password), error alert, submit button.
- Flow: `apiClient.login(email, password)` → save tokens → decode to user → redirect to `/dashboard`.
- Error states: invalid credentials, network error.

### Dashboard (`/dashboard`)
- Purpose: quick overview + entry points.
- Components:
  - `SummaryCards`: totals for Documents, Queries, Users (until metrics API is ready, show placeholders and health status).
  - `QuickActions`: Upload file (→ `/uploads`), Search (→ `/search`), Ask (→ `/ask`).
  - `RecentActivity` (optional): last N uploads or queries—placeholder until backend endpoints exist.

### Search (`/search`)
- Components:
  - `SearchBar` with debounce.
  - `ResultList` of `ResultCard` items.
  - `EmptyState` and `SkeletonList` for loading.
- API: `GET /api/search?q=...`.
- Adapter: map backend `{ id, text, metadata, score }` → UI item `{ id, title, excerpt, sourceType, sourceId, metadata, score }` by deriving:
  - `title`: `metadata?.title ?? (text.slice(0, 80) + '…')`
  - `excerpt`: first ~160 chars from `text`
  - `sourceType`: `metadata?.sourceType ?? 'document'`
  - `sourceId`: `metadata?.sourceId ?? id`

### Ask / Chat (`/ask`)
- Components:
  - `ChatWindow` (already present): message list, input box, send button.
  - `SourceAttributions` under answers when available.
- API: `POST /api/ask` with `{ query, topK? }`. Handle stub answer gracefully when LLM not configured.
- Optional: streaming via SSE/WebSocket in future; for now, simple request/response.

### Uploads (`/uploads`)
- Components:
  - `FileUpload` with drag-and-drop and file input; list uploaded items (optional future enhancement).
- API: `POST /api/files/upload` (FormData `file`). Show success toast with returned `documentId`.
- Empty/blocked state: if S3 not configured, show banner warning.

### Admin Metrics (`/admin`)
- Guard: admin only; if role missing, restrict to 403 view.
- Components:
  - `MetricsGrid`: `totalDocuments`, `totalQueries`, `totalUsers`, usage breakdowns. Until API returns real values, show placeholders with health status.
- API: `GET /api/admin/metrics`.

### NotFound (`*`)
- Simple 404 card with links back to `/dashboard` or `/`.

---

## 4) Reusable components

- Layout
  - `Navbar` (public) and `AppShell` (auth): topbar, optional sidebar for dashboard tools.
- Auth
  - `ProtectedRoute`, `LoginForm`.
- Search
  - `SearchBar`, `ResultCard`, `ResultList`, `SkeletonList`, `EmptyState`.
- Chat
  - `ChatWindow`, `MessageBubble`, `SourceAttributions`.
- Files
  - `FileUpload`, `UploadCard` (optional list view).
- Feedback
  - `Toast`/`Toaster`, `ErrorBoundary`.

---

## 5) API integration and contracts

Base URL precedence: `VITE_API_BASE_URL` → `window.__API_BASE_URL__` → fallback `/api` (dev: `http://localhost:4000/api`).

- Auth
  - Login request
    ```json
    { "email": "string", "password": "string" }
    ```
  - Login response
    ```json
    { "accessToken": "jwt", "refreshToken": "jwt" }
    ```
  - Refresh request
    ```json
    { "refreshToken": "jwt" }
    ```
  - Refresh response
    ```json
    { "accessToken": "jwt" }
    ```

- Search (current backend)
  - Response
    ```json
    { "query": "string", "results": [ { "id": "string", "text": "string", "metadata": { }, "score": 0.0 } ] }
    ```
  - UI adapter (TypeScript)
    ```ts
    type BackendSearchItem = { id: string; text: string; metadata?: any; score: number };
    type UISearchItem = { id: string; title: string; excerpt: string; sourceType: string; sourceId: string; metadata?: any; score: number };
    export function adaptSearchItem(r: BackendSearchItem): UISearchItem {
      const title = r?.metadata?.title ?? (r.text?.slice(0, 80) + (r.text?.length > 80 ? '…' : ''));
      const excerpt = r.text?.slice(0, 160) + (r.text?.length > 160 ? '…' : '');
      const sourceType = r?.metadata?.sourceType ?? 'document';
      const sourceId = r?.metadata?.sourceId ?? r.id;
      return { id: r.id, title, excerpt, sourceType, sourceId, metadata: r.metadata, score: r.score };
    }
    ```

- Ask
  - Request
    ```json
    { "query": "string", "topK": 5 }
    ```
  - Response
    ```json
    { "query": "string", "answer": "string", "sources": [ { "id": "string", "title": "string", "excerpt": "string", "sourceType": "string", "score": 0.0, "url": "string" } ] }
    ```
  - Note: when OpenAI key not configured, `answer` is a stub; handle politely in UI.

- Files / Uploads
  - Request: multipart/form-data with field `file`
  - Response (current backend)
    ```json
    { "key": "s3/key", "documentId": "doc_..." }
    ```
  - UI: show success with `documentId`. Consider storing `key` in local “recent uploads”.

- Admin metrics (placeholder)
  - Response (future)
    ```json
    { "totalDocuments": 0, "totalQueries": 0, "totalUsers": 0, "workspaceUsage": {} }
    ```

---

## 6) UX states

- Loading: skeletons for search results and dashboard cards.
- Empty: friendly prompts (e.g., “Try searching for…”). For Ask: guidance text before first question.
- Errors: inline error banners on forms; toast notifications for network/API errors; unauthorized → redirect to `/login`.
- Disabled features: if uploads disabled (no S3), show banner with setup link.

---

## 7) Accessibility and performance

- Use semantic HTML; provide labels for inputs, aria-live for toasts and chat updates.
- Keyboard navigation: focus traps in dialogs; Enter to send in chat; Escape to clear input.
- Debounce search (300–400ms). Avoid blocking UI during token refresh.
- Split routes and heavy components; lazy load the Ask page and charts.

---

## 8) Builder.io content model

- Models
  - `landing-page`
    - `hero` (object): `headline`, `subheadline`, `primaryCTA`, `secondaryCTA`, `badges[]`
    - `highlights[]` (array): `icon`, `title`, `description`
    - `features[]` (array): `icon`, `title`, `description`
    
    - `testimonials[]` (array): `quote`, `author`, `role`
    - `faq[]` (array): `question`, `answer`
    - `pricing` (object): `ctaTitle`, `ctaSubtitle`, `primaryCTA`, `secondaryCTA`
- Use slots/sections mapping to the React structure for easy substitution.

---

## 9) Rollout checklist

- [ ] Set `VITE_API_BASE_URL` or `window.__API_BASE_URL__` in production.
- [ ] Seed Postgres and run worker for embeddings.
- [ ] Configure S3-compatible storage or hide Uploads.
- [ ] Resolve backend duplicate routes and add missing controllers or keep inline handlers.
- [ ] Optionally normalize search response or keep client adapter.
- [ ] Implement admin metrics or keep placeholders.

This spec aims to be immediately implementable with the current repo while providing clear fallback behavior where the backend is still stabilizing.


