'use client';

import React, { useState } from 'react';
import { Inbox } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { FilterBar } from './FilterBar';
import { BulkActionBar } from './BulkActionBar';
import { DetailDrawer } from './DetailDrawer';
import type { ListPageProps } from './types';

/**
 * ListPage 通用列表页组件
 *
 * 特性:
 * - 标题/副标题/工具栏
 * - 搜索/筛选条
 * - 数据表格
 * - 批量选择 + 批量操作
 * - 详情抽屉（点击行/操作按钮触发）
 * - 分页器
 */
export function ListPage<T extends Record<string, any>>({
  title,
  subtitle,
  toolbar,

  searchPlaceholder,
  searchValue,
  onSearchChange,

  filters,
  filterValues,
  onFilterChange,

  data,
  columns,
  rowKey = 'id',
  loading = false,
  emptyText = '暂无数据',

  selectable = false,
  selectedIds = [],
  onSelectionChange,
  bulkActions = [],

  renderDetail,
  detailWidth = 'max-w-2xl',

  pagination,

  className = '',
}: ListPageProps<T>) {
  const [detailItem, setDetailItem] = useState<T | null>(null);

  // 选中行 key 提取
  const getRowKey = (item: T): string => {
    if (typeof rowKey === 'function') return (rowKey as (item: T) => string)(item);
    return String((item as Record<string, unknown>)[rowKey as string]);
  };

  // 全选/取消全选
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map(getRowKey));
    }
  };

  // 单行选择
  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  // 增强 columns：注入复选框 + 操作列
  const finalColumns = selectable
    ? [
        {
          key: '__select__',
          title: (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-[#2A354D] bg-[#111625] cursor-pointer"
              aria-label="全选"
            />
          ),
          width: '40px',
          render: (item: T) => (
            <input
              type="checkbox"
              checked={selectedIds.includes(getRowKey(item))}
              onChange={() => handleSelectRow(getRowKey(item))}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-[#2A354D] bg-[#111625] cursor-pointer"
              aria-label="选择"
            />
          ),
        },
        ...columns,
      ]
    : columns;

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div>
          {title && <h1 className="text-2xl font-bold text-slate-50">{title}</h1>}
          {subtitle && <p className="text-slate-400 mt-1 text-sm">{subtitle}</p>}
        </div>
      )}

      <Card>
        <FilterBar
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={filters}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
          rightSlot={toolbar}
        />
      </Card>

      {bulkActions.length > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          actions={bulkActions}
          selectedIds={selectedIds}
          onClear={() => onSelectionChange?.([])}
        />
      )}

      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">加载中...</div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Inbox className="w-12 h-12 mb-2 text-slate-600" />
            <p>{emptyText}</p>
          </div>
        ) : (
          <Table columns={finalColumns} data={data} rowKey={rowKey} />
        )}
      </Card>

      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>共 {pagination.total} 条</span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => pagination.onChange(pagination.page - 1, pagination.pageSize)}
              className="px-3 py-1 rounded border border-[#2A354D] hover:bg-[#1E2736] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span>
              第 {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)} 页
            </span>
            <button
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange(pagination.page + 1, pagination.pageSize)}
              className="px-3 py-1 rounded border border-[#2A354D] hover:bg-[#1E2736] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {renderDetail && (
        <DetailDrawer
          open={detailItem !== null}
          onClose={() => setDetailItem(null)}
          width={detailWidth}
        >
          {detailItem && renderDetail(detailItem)}
        </DetailDrawer>
      )}
    </div>
  );
}
