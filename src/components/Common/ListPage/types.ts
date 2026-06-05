/**
 * ListPage 通用列表页组件 - 类型定义
 *
 * 提供所有列表型页面的通用能力（搜索/筛选/分页/批量/详情抽屉）
 */

import type { ReactNode } from 'react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  /** 筛选字段 key，对应 filterValues 的键 */
  key: string;
  /** 筛选条显示的标签 */
  label: string;
  /** 选项列表 */
  options: FilterOption[];
  /** 宽度（默认 w-32） */
  width?: string;
}

export interface BulkAction {
  /** 唯一 key */
  key: string;
  /** 按钮文字 */
  label: string;
  /** 图标 */
  icon?: ReactNode;
  /** 点击回调 */
  onClick: (selectedIds: string[]) => void;
  /** 是否危险操作（红色）*/
  danger?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

export interface ListPageProps<T> {
  /** 页面标题 */
  title?: string;
  /** 页面副标题 */
  subtitle?: string;
  /** 顶部工具栏（如新建按钮）*/
  toolbar?: ReactNode;

  /** 搜索 */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  /** 筛选 */
  filters?: FilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;

  /** 表格 */
  data: T[];
  columns: any[];
  /** 唯一键：可以是字段名或提取函数 */
  rowKey?: string | ((item: T) => string);
  loading?: boolean;
  emptyText?: string;

  /** 选择 + 批量操作 */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  bulkActions?: BulkAction[];

  /** 详情抽屉 */
  renderDetail?: (item: T) => ReactNode;
  detailWidth?: string;

  /** 分页 */
  pagination?: PaginationConfig;

  /** 自定义类名 */
  className?: string;
}
