import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { SearchResult, SearchRequest } from '@/types/backend';

export interface SearchFilters {
  sources: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  authors: string[];
  sortBy: 'relevance' | 'date' | 'source';
}

export interface SearchParams {
  query: string;
  filters?: Partial<SearchFilters>;
  limit?: number;
  offset?: number;
}

const defaultFilters: SearchFilters = {
  sources: [],
  dateRange: {},
  authors: [],
  sortBy: 'relevance',
};

async function searchDocuments(params: SearchParams): Promise<{
  results: SearchResult[];
  total: number;
  facets: {
    sources: Array<{ name: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
  };
}> {
  const searchRequest: SearchRequest = {
    query: params.query,
    filters: params.filters ? {
      sourceTypes: params.filters.sources,
      dateRange: params.filters.dateRange.from && params.filters.dateRange.to ? {
        from: params.filters.dateRange.from.toISOString(),
        to: params.filters.dateRange.to.toISOString(),
      } : undefined,
      authors: params.filters.authors,
    } : undefined,
    limit: params.limit || 20,
    offset: params.offset || 0,
    sortBy: params.filters?.sortBy || 'relevance',
  };

  try {
    const response = await apiClient.search(searchRequest.query, {
      limit: searchRequest.limit
    });

    return {
      results: response.results || [],
      total: (response as any).total ?? (response.results?.length ?? 0),
      facets: undefined,
    };
  } catch (error) {
    console.error('Search failed:', error);
    throw new Error('Search failed');
  }
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const queryClient = useQueryClient();

  const searchParams: SearchParams = useMemo(() => ({
    query,
    filters: { ...defaultFilters, ...filters },
    limit: 20,
  }), [query, filters]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: () => searchDocuments(searchParams),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const saveMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      // For now, store in localStorage since backend doesn't have saved searches yet
      const saved = JSON.parse(localStorage.getItem('neurosync_saved_searches') || '[]');
      const newSearch = {
        id: Date.now().toString(),
        query: searchQuery,
        createdAt: new Date().toISOString(),
      };
      saved.unshift(newSearch);
      localStorage.setItem('neurosync_saved_searches', JSON.stringify(saved.slice(0, 10)));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
    },
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const saveSearch = (searchQuery?: string) => {
    saveMutation.mutate(searchQuery || query);
  };

  return {
    // State
    query,
    filters,
    isAdvancedMode,
    
    // Data
    results: data?.results || [],
    total: data?.total || 0,
    facets: data?.facets,
    
    // Status
    isLoading,
    error,
    
    // Actions
    setQuery,
    updateFilters,
    clearFilters,
    setIsAdvancedMode,
    refetch,
    saveSearch,
    isSaving: saveMutation.isPending,
  };
}

export function useSavedSearches() {
  return useQuery({
    queryKey: ['saved-searches'],
    queryFn: async () => {
      // Use localStorage for now since backend doesn't have this endpoint yet
      return JSON.parse(localStorage.getItem('neurosync_saved_searches') || '[]');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRecentSearches() {
  return useQuery({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      // Use localStorage for now since backend doesn't have this endpoint yet
      return JSON.parse(localStorage.getItem('neurosync_recent_searches') || '[]');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
