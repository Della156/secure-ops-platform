'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage — 状态持久化到 localStorage
 * - SSR 安全（首屏返回 initialValue，避免水合不一致）
 * - 自动监听跨标签页 storage 事件
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // 客户端初次挂载时从 localStorage 读取
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (e) {
      console.warn(`[useLocalStorage] 读取 ${key} 失败:`, e);
    }
    setHydrated(true);
  }, [key]);

  // 跨标签页同步
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setStoredValue(JSON.parse(e.newValue) as T);
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key]);

  // 更新 + 写入
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(next));
          } catch (e) {
            console.warn(`[useLocalStorage] 写入 ${key} 失败:`, e);
          }
        }
        return next;
      });
    },
    [key]
  );

  // 清除
  const remove = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (e) {
      console.warn(`[useLocalStorage] 删除 ${key} 失败:`, e);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}

export default useLocalStorage;
