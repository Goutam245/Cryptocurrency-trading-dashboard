
import { useState, useEffect, useRef, useCallback } from 'react';

interface PriceData {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

interface WebSocketPriceHook {
  data: PriceData | null;
  isConnected: boolean;
  reconnect: () => void;
  latency: number;
}

export const useWebSocketPrice = (symbol: string = 'BTCUSDT'): WebSocketPriceHook => {
  const [data, setData] = useState<PriceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const pingTimeRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);

  const processMessage = useCallback((event: MessageEvent) => {
    const receivedTime = performance.now();
    
    try {
      const tickerData = JSON.parse(event.data);
      
      // Calculate ultra-precise latency
      const currentLatency = receivedTime - pingTimeRef.current;
      setLatency(Math.round(currentLatency));
      pingTimeRef.current = receivedTime;

      // Optimized state update with minimal re-renders
      setData(prevData => {
        const newData = {
          symbol: tickerData.s,
          price: parseFloat(tickerData.c),
          priceChange: parseFloat(tickerData.p),
          priceChangePercent: parseFloat(tickerData.P),
          high: parseFloat(tickerData.h),
          low: parseFloat(tickerData.l),
          volume: parseFloat(tickerData.v),
          timestamp: receivedTime
        };
        
        // Prevent unnecessary re-renders if data hasn't changed significantly
        if (prevData && Math.abs(prevData.price - newData.price) < 0.01) {
          return prevData;
        }
        
        return newData;
      });
    } catch (error) {
      console.warn('Failed to parse WebSocket message:', error);
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      // Use fastest Binance stream endpoint for sub-200ms latency
      const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
      wsRef.current = new WebSocket(wsUrl);
      
      // Optimize WebSocket settings for minimal latency
      wsRef.current.binaryType = 'arraybuffer';

      wsRef.current.onopen = () => {
        console.log(`WebSocket connected for ${symbol}`);
        setIsConnected(true);
        pingTimeRef.current = performance.now();
        reconnectAttempts.current = 0;
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = processMessage;

      wsRef.current.onclose = (event) => {
        console.log(`WebSocket disconnected for ${symbol}`, event.code);
        setIsConnected(false);
        
        // Smart exponential backoff with jitter for optimal reconnection
        if (reconnectAttempts.current < 5) {
          const baseDelay = Math.min(1000 * Math.pow(1.5, reconnectAttempts.current), 5000);
          const jitter = Math.random() * 1000;
          const delay = baseDelay + jitter;
          
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [symbol, processMessage]);

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    if (wsRef.current) {
      wsRef.current.close();
    }
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { data, isConnected, reconnect, latency };
};
