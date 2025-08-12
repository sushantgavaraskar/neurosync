import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/backend';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = apiClient.isAuthenticated();

  function decodeJwt(token: string): any | null {
    try {
      const [, payload] = token.split('.');
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      return null;
    }
  }

  function userFromToken(token: string): User | null {
    const payload = decodeJwt(token);
    if (!payload) return null;
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowSec) return null;
    return {
      id: String(payload.sub ?? ''),
      email: String(payload.email ?? ''),
      role: 'member',
      workspaceId: String(payload.workspaceId ?? ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    }

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          await refreshAuth();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          apiClient.logout();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await apiClient.login(email, password);
      const token = apiClient.getAccessToken();
      const decoded = token ? userFromToken(token) : null;
      setUser(decoded);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  const refreshAuth = async () => {
    try {
      const refreshed = await apiClient.refreshToken();
      if (!refreshed) {
        throw new Error('Token refresh failed');
      }
      const token = apiClient.getAccessToken();
      const decoded = token ? userFromToken(token) : null;
      if (decoded) setUser(decoded);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
