CREATE EXTENSION IF NOT EXISTS vector;

-- Tenants and users
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  workspace_id TEXT NOT NULL REFERENCES workspaces(id)
);

-- Documents and embeddings
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT,
  text TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 384 dims for all-MiniLM-L6-v2
CREATE TABLE IF NOT EXISTS document_embeddings (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  chunk_index INTEGER NOT NULL DEFAULT 0,
  embedding vector(384),
  text TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_embeddings_ws ON document_embeddings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_ws ON documents(workspace_id);


