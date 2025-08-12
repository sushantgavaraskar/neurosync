// API client aligned with NeuroSync backend
// Prefer Vite env, then window override, then sensible defaults
const API_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL)
  || (typeof window !== 'undefined' && (window as any).__API_BASE_URL__)
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '/api');

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('neurosync_access_token');
    }
  }

  private saveTokenToStorage(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('neurosync_access_token', token);
      this.accessToken = token;
    }
  }

  private removeTokenFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neurosync_access_token');
      localStorage.removeItem('neurosync_refresh_token');
      this.accessToken = null;
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token is available
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 unauthorized - attempt token refresh
      if (response.status === 401 && this.accessToken) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          headers.Authorization = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, { ...config, headers });
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          return retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          this.removeTokenFromStorage();
          window.location.href = '/';
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.makeRequest<{ accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.saveTokenToStorage(response.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('neurosync_refresh_token', response.refreshToken);
    }

    return response;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('neurosync_refresh_token')
        : null;

      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.saveTokenToStorage(data.accessToken);
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    this.removeTokenFromStorage();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // File operations
  async uploadFile(file: File): Promise<{ success: boolean; fileId?: string; message?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseURL}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Search operations
  async search(query: string, options: { limit?: number } = {}): Promise<{
    results: Array<{
      id: string;
      title: string;
      excerpt: string;
      sourceType: string;
      sourceId: string;
      score: number;
      metadata: Record<string, any>;
    }>;
  }> {
    const params = new URLSearchParams({ q: query });
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    return this.makeRequest(`/search?${params.toString()}`);
  }

  // AI/RAG operations
  async ask(query: string, topK?: number): Promise<{
    answer: string;
    sources: Array<{
      id: string;
      title: string;
      excerpt: string;
      sourceType: string;
      score: number;
      url?: string;
    }>;
  }> {
    return this.makeRequest('/ask', {
      method: 'POST',
      body: JSON.stringify({ query, topK }),
    });
  }

  // Admin operations
  async getMetrics(): Promise<{
    totalDocuments: number;
    totalQueries: number;
    totalUsers: number;
    workspaceUsage: Record<string, any>;
  }> {
    return this.makeRequest('/admin/metrics');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    // Health is exposed at backend root, not under /api
    const healthBase = this.baseURL.replace(/\/?api\/?$/, '');
    const response = await fetch(`${healthBase}/health`);
    return response.json();
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
