'use client';
import React, { useState } from 'react';
import { Search, Eye, RefreshCw, Download, AlertTriangle, CheckCircle, Activity, Clock, X } from 'lucide-react';
import { useAsyncData, mockApi } from '@/hooks/useAsyncData';
import { useTable } from '@/hooks/useTable';
import { useInteraction } from '@/hooks/useInteraction';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { DataTable, Pagination } from '@/components/Common/DataTable';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { SearchBar, FilterTabs } from '@/components/Common/SearchBar';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/Common/PageStates';

export interface SubPageColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface StandardSubPageProps {
  title: string;
  description: string;
  mockData: any[];
  columns: SubPageColumn[];
  /** 额外的统计卡片（在默认 总/运行中/已完成/失败 之外） */
  extraStats?: (data: any[]) => { title: string; value: any; color?: any; icon?: React.ReactNode; subtitle?: string }[];
  /** 详情弹窗的自定义内容 */
  detailRender?: (row: any) => React.ReactNode;
  /** 操作按钮的自定义渲染 */
  actionRender?: (row: any, actions: { showDetail: () => void; showToast: (msg: string, type: 'success'|'error'|'info') => void }) => React.ReactNode;
  tableRowKey?: string;
  statusField?: string;
  nameField?: string;
}

export function StandardSubPage({ title, description, mockData, columns: extraColumns, extraStats, detailRender, actionRender, tableRowKey = 'id', statusField = 'status', nameField = 'name' }: StandardSubPageProps) {
  const interaction = useInteraction();
  const { showModal, showConfirm, showToast, ConfirmDialog, DetailModal, Toast } = interaction;

  const { data, isLoading, isError, isEmpty, refresh } = useAsyncData(() => mockApi(mockData, 0.05), []);
  const table = useTable({ data: data || [], defaultPageSize: 10, defaultSort: { key: 'id', direction: 'desc' } });

  const items = data || [];
  const statusCounts = {
    total: items.length,
    running: items.filter((d: any) => d[statusField] === 'running').length,
    completed: items.filter((d: any) => d[statusField] === 'completed').length,
    failed: items.filter((d: any) => d[statusField] === 'failed').length,
    pending: items.filter((d: any) => d[statusField] === 'pending').length,
  };

  const statusLabels = [
    { label: '全部', value: '', count: items.length },
    { label: '运行中', value: 'running', count: statusCounts.running },
    { label: '已完成', value: 'completed', count: statusCounts.completed },
    { label: '失败', value: 'failed', count: statusCounts.failed },
    { label: '待执行', value: 'pending', count: statusCounts.pending },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const defaultDetail = (row: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(row).filter(([k]) => k !== 'id' && !k.startsWith('_')).slice(0, 6).map(([k, v]) => (
          <div key={k} className="bg-[#131B2A] p-3 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">{k}</p>
            {k === statusField ? <StatusBadge status={v as string} pulse={(v as string) === 'running'} /> :
             <p className="text-white text-sm">{String(v)}</p>}
          </div>
        ))}
      </div>
      <div className="border-t border-[#2A354D] pt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">操作记录</h4>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 bg-[#131B2A] p-3 rounded-lg text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-gray-400">步骤 {i}</span>
              <span className="text-xs text-gray-600 ml-auto">2026-06-02 08:0{i}:00</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const defaultActionRender = (row: any, { showDetail }: { showDetail: () => void }) => (
    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
      <button onClick={() => showDetail()} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
        <Eye className="w-3.5 h-3.5" /> 详情
      </button>
    </div>
  );

  const baseColumns = [
    { key: '_select', title: <input type="checkbox" onChange={(e) => { if (e.target.checked) setSelectedIds(items.map((d: any) => d.id)); else setSelectedIds([]); }} checked={selectedIds.length === items.length && items.length > 0} className="accent-blue-500" />, width: '40px', render: (_: any, row: any) => (
      <input type="checkbox" onChange={() => toggleSelect(row.id)} checked={selectedIds.includes(row.id)} className="accent-blue-500" onClick={e => e.stopPropagation()} />
    )},
    { key: 'id', title: 'ID', width: '100px' },
    { key: nameField, title: '名称', sortable: true },
    { key: statusField, title: '状态', render: (v: string) => <StatusBadge status={v} pulse={v === 'running'} /> },
    ...extraColumns,
    { key: '_actions', title: '操作', width: '120px', render: (_: any, row: any) => {
      const act = actionRender || defaultActionRender;
      return act(row, {
        showDetail: () => showModal({ title: `${row[nameField] || ''} 详情`, content: detailRender ? detailRender(row) : defaultDetail(row) }),
        showToast,
      });
    }},
  ];

  if (isLoading) return <LoadingState message={`正在加载${title}数据...`} />;
  if (isError) return <ErrorState message={`加载${title}失败`} onRetry={refresh} />;
  if (isEmpty) return <EmptyState message={`暂无${title}数据`} />;

  return (
    <div>
      <PageHeader title={title} description={description}
        actions={[
          <button key="refresh" onClick={refresh} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="export" onClick={() => showToast('导出任务已提交', 'success')} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <Download className="w-4 h-4" /> 导出
          </button>,
          selectedIds.length > 0 && (
            <button key="batch" onClick={() => showConfirm({ title: '批量操作', message: `确定要对 ${selectedIds.length} 条数据执行批量处理吗？`, type: 'warning', onConfirm: () => { showToast('批量处理已完成', 'success'); setSelectedIds([]); } })}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm hover:bg-yellow-500/30">
              <AlertTriangle className="w-4 h-4" /> 批量处理 ({selectedIds.length})
            </button>
          ),
        ].filter(Boolean)}
      />

      <StatsCardGrid cols={Math.min(5, 3 + (extraStats ? extraStats(items).length : 0))}>
        <StatsCard title="总记录" value={statusCounts.total} />
        <StatsCard title="进行中" value={statusCounts.running} icon={<Activity className="w-5 h-5" />} color="blue" />
        <StatsCard title="已完成" value={statusCounts.completed} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <StatsCard title="失败" value={statusCounts.failed} icon={<AlertTriangle className="w-5 h-5" />} color="red" subtitle="需人工介入" />
        <StatsCard title="待执行" value={statusCounts.pending} icon={<Clock className="w-5 h-5" />} color="yellow" />
        {extraStats && extraStats(items).map((s, i) => (
          <StatsCard key={i} title={s.title} value={s.value} icon={s.icon} color={s.color || 'default'} subtitle={s.subtitle} />
        ))}
      </StatsCardGrid>

      <div className="flex flex-col gap-4 mb-6">
        <FilterTabs options={statusLabels} value={table.filters.find(f => f.key === statusField)?.value || ''}
          onChange={(v) => table.setFilter(statusField, v)} />
        <div className="flex items-center gap-3">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder={`搜索${nameField}...`} />
          {table.hasFilters && <button onClick={table.resetFilters} className="text-xs text-gray-500 hover:text-gray-300">清除筛选</button>}
        </div>
      </div>

      <DataTable columns={baseColumns} data={table.data} sort={table.sort} onSort={table.toggleSort}
        onRowClick={(row) => showModal({ title: `${row[nameField] || ''} 详情`, content: detailRender ? detailRender(row) : defaultDetail(row) })} />
      <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={table.pageSize}
        onPageChange={table.setPage} onPageSizeChange={table.setPageSize} />

      {ConfirmDialog}
      {DetailModal}
      {Toast}
    </div>
  );
}
