import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface UseWebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface UseWebSocketResult {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  send: (message: any) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useWebSocket(
  url: string | null,
  options: UseWebSocketOptions = {}
): UseWebSocketResult {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onConnect,
    onDisconnect,
    onError,
    onMessage,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      wsRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!url || !mountedRef.current) return;
    
    cleanup();
    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectCountRef.current = 0;
        onConnect?.();
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();

        // Auto-reconnect if not closed manually
        if (event.code !== 1000 && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          setError(`Connection lost. Retrying... (${reconnectCountRef.current}/${reconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, reconnectInterval);
        } else if (reconnectCountRef.current >= reconnectAttempts) {
          setError('Failed to connect after multiple attempts');
        }
      };

      ws.onerror = (event) => {
        if (!mountedRef.current) return;
        
        setError('WebSocket connection error');
        setIsConnecting(false);
        onError?.(event);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
      setIsConnecting(false);
    }
  }, [url, onConnect, onDisconnect, onError, onMessage, reconnectAttempts, reconnectInterval, cleanup]);

  const send = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send WebSocket message:', err);
        setError('Failed to send message');
      }
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    mountedRef.current = false;
    cleanup();
    setIsConnected(false);
    setIsConnecting(false);
  }, [cleanup]);

  const reconnect = useCallback(() => {
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [url, connect, cleanup]);

  return {
    isConnected,
    isConnecting,
    error,
    send,
    disconnect,
    reconnect,
  };
}

// Hook for real-time sync status updates
export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<{
    [source: string]: {
      status: 'syncing' | 'idle' | 'error';
      lastSync: string;
      documentsCount: number;
    };
  }>({});

  const { isConnected, send } = useWebSocket(
    null,
    {
      onMessage: (message) => {
        if (message.type === 'sync_status') {
          setSyncStatus(message.payload);
        }
      },
    }
  );

  const requestSyncStatus = useCallback(() => {
    send({ type: 'request_sync_status' });
  }, [send]);

  useEffect(() => {
    if (isConnected) {
      requestSyncStatus();
    }
  }, [isConnected, requestSyncStatus]);

  return {
    syncStatus,
    isConnected,
    requestSyncStatus,
  };
}
