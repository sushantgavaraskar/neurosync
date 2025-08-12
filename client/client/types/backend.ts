// TypeScript interfaces matching NeuroSync backend Prisma schema

export interface Workspace {
  id: string;
  name: string;
  tenantPlan: 'starter' | 'professional' | 'enterprise';
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'readonly';
  workspaceId: string;
  workspace?: Workspace;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
}

export interface Document {
  id: string;
  workspaceId: string;
  sourceType: 'slack' | 'notion' | 'github' | 'gmail' | 'drive' | 'upload';
  sourceId: string;
  title?: string;
  text: string;
  metadata: Record<string, any>;
  status: 'pending' | 'processing' | 'indexed' | 'error';
  createdAt: string;
  updatedAt: string;
  workspace?: Workspace;
}

export interface QueryLog {
  id: string;
  workspaceId: string;
  userId: string;
  queryText: string;
  retrievedSources: Array<{
    documentId: string;
    score: number;
    excerpt: string;
  }>;
  response?: string;
  tokensUsed?: number;
  createdAt: string;
  user?: User;
  workspace?: Workspace;
}

// API Response types
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  sourceType: string;
  sourceId: string;
  score: number;
  metadata: Record<string, any>;
  url?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total?: number;
  query: string;
  processingTime?: number;
}

export interface AskResponse {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    excerpt: string;
    sourceType: string;
    score: number;
    url?: string;
  }>;
  queryId?: string;
  tokensUsed?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    workspaceId: string;
  };
}

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  message?: string;
  status?: string;
}

export interface MetricsResponse {
  totalDocuments: number;
  totalQueries: number;
  totalUsers: number;
  workspaceUsage: {
    storageUsed: number;
    queriesThisMonth: number;
    documentsIndexed: number;
    activeUsers: number;
  };
  recentActivity: Array<{
    type: 'search' | 'ask' | 'upload';
    timestamp: string;
    userId: string;
    details: Record<string, any>;
  }>;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

// Streaming types for SSE
export interface StreamMessage {
  type: 'chunk' | 'source' | 'done' | 'error';
  content?: string;
  sources?: SearchResult[];
  error?: string;
  timestamp: string;
}

// Integration status types
export interface IntegrationStatus {
  sourceType: string;
  connected: boolean;
  lastSync?: string;
  documentsCount: number;
  status: 'active' | 'error' | 'syncing';
  error?: string;
}

// Real-time WebSocket message types
export interface WebSocketMessage {
  type: 'sync_status' | 'new_document' | 'query_complete' | 'error';
  workspaceId: string;
  payload: any;
  timestamp: string;
}

// Quota and usage types
export interface QuotaInfo {
  plan: string;
  limits: {
    documents: number;
    queries: number;
    storage: number; // in bytes
    users: number;
  };
  usage: {
    documents: number;
    queries: number;
    storage: number;
    users: number;
  };
  resetDate?: string;
}

// Search filters
export interface SearchFilters {
  sourceTypes?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  authors?: string[];
  metadata?: Record<string, any>;
}

// Advanced search request
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  includeMetadata?: boolean;
  sortBy?: 'relevance' | 'date' | 'source';
}
