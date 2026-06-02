'use client';

import React from 'react';

interface DataTableProps<T> {
  columns: {
    key: string;
    title: string | React.ReactNode;
    render?: (value: any, row: T, index: number) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
  }[];
  data: T[];
  sort?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyText?: string;
  rowKey?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  sort,
  onSort,
  onRowClick,
  loading,
  emptyText = '暂无数据',
  rowKey = 'id',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#2A354D]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#1E2736]/80 text-gray-400 text-sm">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 font-medium ${col.sortable ? 'cursor-pointer hover:text-gray-200 select-none' : ''} ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                }`}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="flex items-center gap-1">
                  {col.title}
                  {col.sortable && sort?.key === col.key && (
                    <span className="text-blue-400">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skel-${i}`} className="border-t border-[#2A354D]">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    <div className="h-4 bg-[#2A354D] rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <span>{emptyText}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row[rowKey] || idx}
                className={`border-t border-[#2A354D] text-sm ${
                  onRowClick ? 'cursor-pointer hover:bg-[#1E2736]/50' : 'hover:bg-[#1E2736]/30'
                } transition-colors`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row[col.key], row, idx) : (
                      <span className="text-gray-300">{row[col.key] ?? '-'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        共 {total} 条，每页 {pageSize} 条
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 text-sm rounded bg-[#1E2736] border border-[#2A354D] text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm rounded ${
                p === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1E2736] border border-[#2A354D] text-gray-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 text-sm rounded bg-[#1E2736] border border-[#2A354D] text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
