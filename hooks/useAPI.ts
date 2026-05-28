'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface UseAPIOptions {
  skip?: boolean;
  refetchInterval?: number;
}

interface UseAPIResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAPI<T>(
  endpoint: string,
  options?: UseAPIOptions
): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(!options?.skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (options?.skip) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      console.error(`[v0] API error fetching ${endpoint}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, options?.skip]);

  useEffect(() => {
    fetchData();

    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options?.refetchInterval]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
