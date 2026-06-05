'use client';

/**
 * 表格组件 — 数据驱动模式
 *
 * ✅ 正确用法：
 * ```
 * <Table columns={columns} data={dataList} rowKey="id" />
 * ```
 *
 * ❌ 禁止（shadcn 风格）：
 * ```
 * <Table><TableHeader>...</TableHeader></Table>
 * ```
 */

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
  columns?: TableColumn<T>[];
  data?: T[];
  rowKey?: keyof T | ((item: T) => string);
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  className?: string;
  children?: React.ReactNode;
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
  children,
}: TableProps<T>) {
  // shadcn 兼容模式：通过 children 自定义表格结构
  if (children) {
    return (
      <div className={`bg-app-bg-card border border-app-border-base rounded-xl overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {children}
          </table>
        </div>
      </div>
    );
  }

  // 数据驱动模式：使用 columns / data 渲染
  const getKey = (item: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(item);
    return String(item[rowKey as keyof T] ?? index);
  };

  if (loading) {
    return (
      <div className="bg-app-bg-card border border-app-border-base rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-app-text-secondary text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-app-bg-card border border-app-border-base rounded-xl overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-app-text-muted text-sm">{emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-app-bg-card border border-app-border-base rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-app-border-base">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-app-text-muted uppercase tracking-wider"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.title}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-app-text-muted uppercase tracking-wider">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border-base">
            {data.map((item, index) => (
              <tr
                key={getKey(item, index)}
                className={`hover:bg-app-bg-surface/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
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

/* ========== shadcn 兼容的 Table 子组件 ========== */

interface TableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-app-bg-surface/50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-app-border-base ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-app-bg-surface/50 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-sm text-app-text-secondary whitespace-nowrap ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableHead({ className = '', children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-app-text-muted uppercase tracking-wider ${className}`} {...props}>
      {children}
    </th>
  );
}
