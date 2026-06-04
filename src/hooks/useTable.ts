'use client';
import { useState, useMemo, useCallback } from 'react';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  key: string;
  value: string;
}

interface UseTableOptions<T> {
  data: T[];
  defaultPageSize?: number;
  defaultSort?: SortConfig;
}

interface UseTableResult<T> {
  /** Current page data (filtered + sorted + paginated) */
  data: T[];
  /** All data after filtered + sorted (before pagination) */
  filteredData: T[];
  /** Current sort config */
  sort: SortConfig;
  /** Toggle sort direction or switch sort key */
  toggleSort: (key: string) => void;
  /** Current page (1-indexed) */
  page: number;
  /** Total pages */
  totalPages: number;
  /** Total items (after filtering) */
  total: number;
  /** Page size */
  pageSize: number;
  /** Set page */
  setPage: (page: number) => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Search text */
  search: string;
  /** Set search text */
  setSearch: (text: string) => void;
  /** Active filters */
  filters: FilterConfig[];
  /** Set a filter value (empty string to clear) */
  setFilter: (key: string, value: string) => void;
  /** Whether any filters are active */
  hasFilters: boolean;
  /** Reset all filters and search */
  resetFilters: () => void;
}

export function useTable<T extends Record<string, any>>({
  data,
  defaultPageSize = 10,
  defaultSort = { key: 'id', direction: 'desc' },
}: UseTableOptions<T>): UseTableResult<T> {
  const [sort, setSort] = useState<SortConfig>(defaultSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterConfig[]>([]);

  const hasFilters = search.trim().length > 0 || filters.some(f => f.value !== '');

  const resetFilters = useCallback(() => {
    setSearch('');
    setFilters([]);
    setPage(1);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters(prev => {
      const existing = prev.findIndex(f => f.key === key);
      if (existing >= 0) {
        if (value === '') {
          return prev.filter(f => f.key !== key);
        }
        const next = [...prev];
        next[existing] = { key, value };
        return next;
      }
      if (value === '') return prev;
      return [...prev, { key, value }];
    });
    setPage(1);
  }, []);

  const toggleSort = useCallback((key: string) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    for (const filter of filters) {
      if (filter.value) {
        result = result.filter(item => String(item[filter.key]) === filter.value);
      }
    }

    // Apply search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(item =>
        Object.values(item).some(v =>
          String(v).toLowerCase().includes(q)
        )
      );
    }

    // Apply sort
    result.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [data, filters, search, sort]);

  const total = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamp page
  const clampedPage = Math.min(page, totalPages);
  if (clampedPage !== page) {
    setPage(clampedPage);
  }

  const pagedData = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, clampedPage, pageSize]);

  return {
    data: pagedData,
    filteredData,
    sort,
    toggleSort,
    page: clampedPage,
    totalPages,
    total,
    pageSize,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    search,
    setSearch: (text: string) => {
      setSearch(text);
      setPage(1);
    },
    filters,
    setFilter,
    hasFilters,
    resetFilters,
  };
}
