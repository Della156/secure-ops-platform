'use client';

import { useState } from 'react';
import { History, Search, Filter, Eye, Calendar, X, FileSearch, BarChart3, Zap, CheckCircle, AlertTriangle, Settings, Play, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

const mockHistory = [
  { id: 'ADH-001', name: '告警分析决策任务A', startTime: '2024-01-14 08:00:00', endTime: '2024-01-14 18:00:00', status: 'completed', pendingAlerts: 0, decidedCount: 200, autoDisposed: 156 },
  { id: 'ADH-002', name: '告警分析决策任务B', startTime: '2024-01-14 08:00:00', endTime: '2024-01-14 12:00:00', status: 'completed', pendingAlerts: 0, decidedCount: 120, autoDisposed: 78 },
  { id: 'ADH-003', name: '告警分析决策任务C', startTime: '2024-01-13 08:00:00', endTime: '2024-01-13 16:00:00', status: 'completed', pendingAlerts: 0, decidedCount: 180, autoDisposed: 145 },
  { id: 'ADH-004', name: '告警分析决策任务D', startTime: '2024-01-12 08:00:00', endTime: '2024-01-12 10:30:00', status: 'failed', pendingAlerts: 45, decidedCount: 80, autoDisposed: 35 },
  { id: 'ADH-005', name: '告警分析决策任务E', startTime: '2024-01-11 08:00:00', endTime: '2024-01-11 11:30:00', status: 'completed', pendingAlerts: 0, decidedCount: 90, autoDisposed: 65 },
];

const getStatusStyle = (status: string) => status === 'completed'
  ? 'bg-green-500/20 text-green-400 border-green-500/40'
  : 'bg-red-500/20 text-red-400 border-red-500/40';

const getStatusText = (status: string) => status === 'completed' ? '已完成' : '失败';

export function AlertDecisionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof mockHistory[0] | null>(null);

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    { key: 'startTime', title: '执行时间', width: '180px' },
    { key: 'endTime', title: '完成时间', width: '180px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: typeof mockHistory[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    {
      key: 'pendingAlerts', title: '待甄别告警', width: '110px',
      render: (item: typeof mockHistory[0]) => <span className="text-orange-400 font-mono">{item.pendingAlerts}</span>,
    },
    {
      key: 'decidedCount', title: '已决策数', width: '100px',
      render: (item: typeof mockHistory[0]) => <span className="text-green-400 font-mono">{item.decidedCount}</span>,
    },
    {
      key: 'autoDisposed', title: '自动处置数', width: '110px',
      render: (item: typeof mockHistory[0]) => <span className="text-purple-400 font-mono">{item.autoDisposed}</span>,
    },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (item: typeof mockHistory[0]) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
          <Eye className="w-3.5 h-3.5 mr-1" />查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">告警分析决策任务历史查询</h1>
          <p className="text-slate-400 mt-1">查询历史决策任务记录，查看详细执行信息</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="搜索任务名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-32">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: '全部' },
              { value: 'completed', label: '已完成' },
              { value: 'failed', label: '失败' },
            ]}
          />
        </div>
        <Button variant="secondary" size="sm">
          <Calendar className="w-4 h-4 mr-2" />选择日期
        </Button>
        <Button variant="secondary" size="sm">
          <Filter className="w-4 h-4 mr-2" />筛选
        </Button>
      </div>

      <Card padding="none">
        <Table columns={columns} data={filteredHistory} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || '任务详情'}
        width="max-w-2xl"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">任务ID</p>
                <p className="text-slate-50 font-mono mt-1">{selectedItem.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">状态</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border mt-1 ${getStatusStyle(selectedItem.status)}`}>
                  {getStatusText(selectedItem.status)}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">执行时间</p>
                <p className="text-slate-50 text-sm mt-1">{selectedItem.startTime}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">完成时间</p>
                <p className="text-slate-50 text-sm mt-1">{selectedItem.endTime}</p>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-sm mb-3">执行统计</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-orange-400 font-bold text-lg">{selectedItem.pendingAlerts}</p>
                  <p className="text-slate-500 text-xs">待甄别告警</p>
                </div>
                <div>
                  <p className="text-green-400 font-bold text-lg">{selectedItem.decidedCount}</p>
                  <p className="text-slate-500 text-xs">已决策数</p>
                </div>
                <div>
                  <p className="text-purple-400 font-bold text-lg">{selectedItem.autoDisposed}</p>
                  <p className="text-slate-500 text-xs">自动处置数</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AlertDecisionHistory;
