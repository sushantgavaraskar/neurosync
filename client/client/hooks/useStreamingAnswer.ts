import { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { SearchResult } from '@/types/backend';

export interface StreamingMessage {
  type: 'chunk' | 'source' | 'done' | 'error';
  text?: string;
  sources?: SearchResult[];
  error?: string;
}

export interface UseStreamingAnswerResult {
  text: string;
  sources: StreamingMessage['sources'];
  status: 'idle' | 'loading' | 'error' | 'done';
  error: string | null;
  chunks: string[];
  ask: (query: string) => void;
  abort: () => void;
}

export function useStreamingAnswer(): UseStreamingAnswerResult {
  const [chunks, setChunks] = useState<string[]>([]);
  const [sources, setSources] = useState<StreamingMessage['sources']>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('idle');
  }, []);

  const ask = useCallback(async (query: string) => {
    if (!query.trim()) return;

    // Cleanup previous request
    abort();

    // Reset state
    setChunks([]);
    setSources([]);
    setError(null);
    setStatus('loading');

    try {
      // Use the regular ask endpoint (non-streaming)
      const response = await apiClient.ask(query);

      // Simulate streaming by breaking the response into chunks
      const words = response.answer.split(' ');
      const chunkSize = 3; // 3 words per chunk

      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(' ');

        setTimeout(() => {
          setChunks(prev => [...prev, chunk + ' ']);
        }, i * 100); // 100ms delay between chunks
      }

      // Set sources after a delay
      setTimeout(() => {
        setSources(response.sources);
        setStatus('done');
      }, words.length * 100 + 500);

    } catch (err) {
      console.error('Failed to get AI response:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
      setStatus('error');
    }
  }, [abort]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    text: chunks.join(''),
    sources: sources || [],
    status,
    error,
    chunks,
    ask,
    abort,
  };
}
