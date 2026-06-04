'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * Simulate an API call with mock data
 */
export function mockApi<T>(data: T, delay = 0.3): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay * 1000);
  });
}

interface UseAsyncDataResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refresh: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await fetcher();
      setData(result);
    } catch {
      setIsError(true);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && (data === null || (Array.isArray(data) && data.length === 0)),
    refresh: fetchData,
  };
}
