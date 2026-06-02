'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  status: Status;
  error: string | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refresh: () => void;
}

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: any[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const fetchIdRef = useRef(0);

  const execute = useCallback(() => {
    const fetchId = ++fetchIdRef.current;
    setStatus('loading');
    setError(null);
    Promise.resolve(fetcher())
      .then((result) => {
        if (fetchId === fetchIdRef.current) {
          setData(result);
          setStatus('success');
        }
      })
      .catch((err: any) => {
        if (fetchId === fetchIdRef.current) {
          setError(err?.message || '请求失败');
          setStatus('error');
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return {
    data,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && (!data || (Array.isArray(data) && data.length === 0)),
    refresh: execute,
  };
}

/** 模拟网络延迟 */
export function delay(ms: number = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 模拟分页返回 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/** 模拟 API 调用（带延迟和随机失败） */
export async function mockApi<T>(data: T, failRate: number = 0): Promise<T> {
  await delay(400 + Math.random() * 600);
  if (Math.random() < failRate) {
    throw new Error('服务暂时不可用，请稍后重试');
  }
  return data;
}
