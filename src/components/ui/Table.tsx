'use client';

import React from 'react';
import { Button } from './Button';

interface TableColumn<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((item: T) => string);
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = '暂无数据',
  onRowClick,
  actions,
  className = '',
}: TableProps<T>) {
  const getKey = (item: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(item);
    return String(item[rowKey] ?? index);
  };

  if (loading) {
    return (
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#0066FF] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-[#9CA3AF] text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-[#6B7280] text-sm">{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.title}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {data.map((item, index) => (
              <tr
                key={getKey(item, index)}
                className={`hover:bg-[#181F32]/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-[#D1D5DB] whitespace-nowrap">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
