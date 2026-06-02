'use client';
import React, { useState } from 'react';
import { Search, Eye, RefreshCw, Download, Activity, AlertTriangle, CheckCircle, Clock, Play, StopCircle, RotateCcw } from 'lucide-react';
import { useAsyncData, mockApi } from '@/hooks/useAsyncData';
import { useTable } from '@/hooks/useTable';
import { useInteraction } from '@/hooks/useInteraction';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { DataTable, Pagination } from '@/components/Common/DataTable';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { SearchBar, FilterTabs } from '@/components/Common/SearchBar';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/Common/PageStates';

/* --- Type --- */
interface Item {
  id: string;
  name: string;
  status: string;
  totalTasks: number;
  analyzing: number;
  completed: number;
  failed: number;
}

/* --- Mock Data --- */
const mockData: Item[] = [
{ id:'HF-001', name:'核心服务器取证', status:'running', totalTasks:10, analyzing:4, completed:5, failed:1 },
  { id:'HF-002', name:'办公终端取证', status:'completed', totalTasks:6, analyzing:0, completed:6, failed:0 },
  { id:'HF-003', name:'数据库服务器取证', status:'running', totalTasks:8, analyzing:3, completed:4, failed:1 },
  { id:'HF-004', name:'应用服务器取证', status:'failed', totalTasks:5, analyzing:1, completed:2, failed:2 }
];

/* --- Detail Modal --- */
function DetailContent({ row }: { row: Item }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(row).filter(([k])=>k!=='id').slice(0,6).map(([k,v]) => (
          <div key={k} className="bg-[#131B2A] p-3 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">{k}</p>
            {k==='status' ? <StatusBadge status={v as string} pulse={v==='running'} /> : <p className="text-white text-sm">{String(v)}</p>}
          </div>
        ))}
      </div>
      <div className="border-t border-[#2A354D] pt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">执行记录</h4>
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3 bg-[#131B2A] p-3 rounded-lg text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-gray-400">步骤 {i}：{['初始化分析引擎','加载规则库','执行分析任务','生成报告'][i-1] || '完成'}</span>
              <span className="text-xs text-gray-600 ml-auto">2026-06-02 08:0{i}:00</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- Main Component --- */
export function HostForensicsView() {
  const interaction = useInteraction();
  const { showModal, showConfirm, showToast, ConfirmDialog, DetailModal, Toast } = interaction;

  const { data, isLoading, isError, isEmpty, refresh } = useAsyncData(
    () => mockApi(mockData, 0.05), []
  );

  const table = useTable({
    data: data || [],
    defaultPageSize: 5,
    defaultSort: { key: 'id', direction: 'desc' },
  });

  const items = data || [];
  const stats = {
    total: items.length,
    running: items.filter(d => d.status === 'running').length,
    completed: items.filter(d => d.status === 'completed').length,
    failed: items.filter(d => d.status === 'failed').length,
    pending: items.filter(d => d.status === 'pending').length,
  };

  const statusLabels = [
    { label: '全部', value: '', count: items.length },
    { label: '运行中', value: 'running', count: stats.running },
    { label: '已完成', value: 'completed', count: stats.completed },
    { label: '失败', value: 'failed', count: stats.failed },
    { label: '待执行', value: 'pending', count: stats.pending },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const handleAction = (row: Item) => {
    if (row.status === 'failed') {
      showConfirm({ title: '重试任务', message: `确定要重试任务「${row.name}」吗？`, type: 'warning', confirmText: '重试',
        onConfirm: () => { showToast('重试请求已提交', 'success'); },
      });
    } else if (row.status === 'running') {
      showConfirm({ title: '暂停任务', message: `确定要暂停任务「${row.name}」吗？`, type: 'warning',
        onConfirm: () => { showToast('任务已暂停', 'info'); },
      });
    } else {
      showToast('正在查看任务详情', 'info');
    }
  };

  if (isLoading) return <LoadingState message="正在加载数据..." />;
  if (isError) return <ErrorState message="加载失败" onRetry={refresh} />;
  if (isEmpty) return <EmptyState message="暂无数据" />;

  return (
    <div>
      <PageHeader title="主机取证视图" description="自动化主机取证，同步数据、检索日志"
        actions={[
          <button key="refresh" onClick={refresh} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="export" onClick={(e)=>{ e.stopPropagation(); showToast('导出任务已提交', 'success'); }} className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <Download className="w-4 h-4" /> 导出
          </button>,
          selectedIds.length > 0 && (
            <button key="batch" onClick={()=>{ showConfirm({title:'批量操作',message:`确定要对 ${selectedIds.length} 条数据执行批量处理吗？`,type:'warning',onConfirm:()=>{showToast('批量处理已完成','success');setSelectedIds([]);}}); }} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm hover:bg-yellow-500/30">
              <RotateCcw className="w-4 h-4" /> 批量处理 ({selectedIds.length})
            </button>
          ),
        ].filter(Boolean)}
      />

      <StatsCardGrid cols={5}>
        <StatsCard title="总任务" value={stats.total} />
        <StatsCard title="运行中" value={stats.running} icon={<Activity className="w-5 h-5" />} color="blue" />
        <StatsCard title="已完成" value={stats.completed} icon={<CheckCircle className="w-5 h-5" />} color="green" />
        <StatsCard title="失败" value={stats.failed} icon={<AlertTriangle className="w-5 h-5" />} color="red" subtitle="需人工介入" />
        <StatsCard title="待执行" value={stats.pending} icon={<Clock className="w-5 h-5" />} color="yellow" />
      </StatsCardGrid>

      <div className="flex flex-col gap-4 mb-6">
        <FilterTabs options={statusLabels} value={table.filters.find(f=>f.key==='status')?.value||''}
          onChange={(v) => table.setFilter('status', v)} />
        <div className="flex items-center gap-3">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder="搜索任务名称..." />
          {table.hasFilters && (
            <button onClick={table.resetFilters} className="text-xs text-gray-500 hover:text-gray-300 whitespace-nowrap">清除筛选</button>
          )}
        </div>
      </div>

      <DataTable
        columns={[
          { key:'_select', title:<input type="checkbox" onChange={(e)=>{if(e.target.checked)setSelectedIds(items.map(d=>d.id));else setSelectedIds([]);}} checked={selectedIds.length===items.length&&items.length>0} className="accent-blue-500" />, width:'40px', render:(_,row) => (
            <input type="checkbox" onChange={()=>toggleSelect(row.id)} checked={selectedIds.includes(row.id)} className="accent-blue-500" onClick={e=>e.stopPropagation()} />
          )},
          { key:'id', title:'ID', width:'100px' },
          { key:'name', title:'任务名称', sortable:true },
          { key:'status', title:'状态', render:(v) => <StatusBadge status={v} pulse={v==='running'} /> },
  { key:'totalTasks', title:'总任务', sortable:true },
  { key:'analyzing', title:'分析中' },
  { key:'completed', title:'已完成', sortable:true },
  { key:'failed', title:'失败', render:(v) => <span className='text-red-400'>{v}</span> },
          { key:'_actions', title:'操作', width:'160px', render:(_,row) => (
            <div className="flex items-center gap-2" onClick={e=>e.stopPropagation()}>
              <button onClick={()=>showModal({title:'任务详情',content:<DetailContent row={row} />})} className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> 详情</button>
              <button onClick={()=>handleAction(row)} className={`text-xs flex items-center gap-1 ${row.status==='failed'?'text-yellow-400 hover:text-yellow-300':'text-gray-400 hover:text-gray-300'}`}>
                {row.status==='running'?<StopCircle className="w-3.5 h-3.5" />:row.status==='failed'?<RotateCcw className="w-3.5 h-3.5" />:<Play className="w-3.5 h-3.5" />}
                {row.status==='running'?'暂停':row.status==='failed'?'重试':'执行'}
              </button>
            </div>
          )},
        ]}
        data={table.data}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(row) => showModal({title:`${row.name} 详情`,content:<DetailContent row={row} />})}
      />
      <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={table.pageSize}
        onPageChange={table.setPage} onPageSizeChange={table.setPageSize} />

      {ConfirmDialog}
      {DetailModal}
      {Toast}
    </div>
  );
}
