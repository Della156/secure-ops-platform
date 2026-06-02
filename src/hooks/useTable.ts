'use client';

import { useState, useMemo, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  key: string;
  value: string;
}

interface UseTableOptions<T> {
  data: T[];
  defaultPageSize?: number;
  defaultSort?: SortConfig;
}

export function useTable<T extends Record<string, any>>({
  data,
  defaultPageSize = 10,
  defaultSort,
}: UseTableOptions<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState<SortConfig | null>(defaultSort || null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  // 搜索过滤
  const searched = useMemo(() => {
    if (!search.trim()) return data;
    const kw = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((v) =>
        String(v).toLowerCase().includes(kw)
      )
    );
  }, [data, search]);

  // 字段过滤
  const filtered = useMemo(() => {
    if (filters.length === 0) return searched;
    return searched.filter((item) =>
      filters.every((f) => {
        const val = String(item[f.key] ?? '').toLowerCase();
        return val.includes(f.value.toLowerCase());
      })
    );
  }, [searched, filters]);

  // 排序
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort]);

  // 分页
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(
    () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sorted, safePage, pageSize]
  );

  const toggleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const idx = prev.findIndex((f) => f.key === key);
      if (!value) {
        if (idx >= 0) return prev.filter((_, i) => i !== idx);
        return prev;
      }
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { key, value };
        return next;
      }
      return [...prev, { key, value }];
    });
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters([]);
    setPage(1);
    setSort(null);
  }, []);

  return {
    page: safePage,
    pageSize,
    total: sorted.length,
    totalPages,
    data: paged,
    sort,
    search,
    filters,
    hasFilters: search !== '' || filters.length > 0,
    setPage,
    setPageSize,
    setSearch: (v: string) => { setSearch(v); setPage(1); },
    toggleSort,
    setFilter,
    resetFilters,
  };
}
