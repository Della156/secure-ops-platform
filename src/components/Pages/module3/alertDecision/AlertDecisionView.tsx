'use client';

import { useState } from 'react';
import { BarChart3, AlertTriangle, CheckCircle, Zap, Search, Filter, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

const mockTasks = [
  { id: 'AD-001', name: '告警分析决策任务A', status: 'running', pendingAlerts: 12, decidedCount: 85, autoDisposed: 45, startTime: '2024-01-15 08:00:00' },
  { id: 'AD-002', name: '告警分析决策任务B', status: 'running', pendingAlerts: 5, decidedCount: 120, autoDisposed: 78, startTime: '2024-01-15 08:00:00' },
  { id: 'AD-003', name: '告警分析决策任务C', status: 'completed', pendingAlerts: 0, decidedCount: 200, autoDisposed: 156, startTime: '2024-01-14 08:00:00' },
  { id: 'AD-004', name: '告警分析决策任务D', status: 'running', pendingAlerts: 8, decidedCount: 67, autoDisposed: 34, startTime: '2024-01-15 08:00:00' },
  { id: 'AD-005', name: '告警分析决策任务E', status: 'failed', pendingAlerts: 23, decidedCount: 45, autoDisposed: 22, startTime: '2024-01-15 08:00:00' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'running': return '运行中';
    case 'completed': return '已完成';
    case 'failed': return '失败';
    default: return status;
  }
};

export function AlertDecisionView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<typeof mockTasks[0] | null>(null);

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTasks = mockTasks.length;
  const pendingAlerts = mockTasks.reduce((sum, task) => sum + task.pendingAlerts, 0);
  const decidedCount = mockTasks.reduce((sum, task) => sum + task.decidedCount, 0);
  const autoDisposed = mockTasks.reduce((sum, task) => sum + task.autoDisposed, 0);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: typeof mockTasks[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    { key: 'pendingAlerts', title: '待甄别告警', width: '110px', render: (item: typeof mockTasks[0]) => <span className="text-orange-400 font-mono">{item.pendingAlerts}</span> },
    { key: 'decidedCount', title: '已决策数', width: '100px', render: (item: typeof mockTasks[0]) => <span className="text-green-400 font-mono">{item.decidedCount}</span> },
    { key: 'autoDisposed', title: '自动处置数', width: '110px', render: (item: typeof mockTasks[0]) => <span className="text-purple-400 font-mono">{item.autoDisposed}</span> },
    { key: 'startTime', title: '开始时间', width: '180px' },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (item: typeof mockTasks[0]) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedTask(item)}>
          <Eye className="w-3.5 h-3.5 mr-1" />查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">告警分析决策视图</h1>
          <p className="text-slate-400 mt-1">自动化分析告警，智能决策处置方案</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-2" />导出列表
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">总分析任务</p>
              <p className="text-2xl font-bold text-slate-50 mt-1">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">待甄别告警数</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">{pendingAlerts}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">已决策数</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{decidedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">自动处置数</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{autoDisposed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
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
              { value: 'running', label: '运行中' },
              { value: 'completed', label: '已完成' },
              { value: 'failed', label: '失败' },
            ]}
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter className="w-4 h-4 mr-2" />筛选
        </Button>
      </div>

      <Card padding="none">
        <Table columns={columns} data={filteredTasks} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">3</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.name || '任务详情'}
        width="max-w-2xl"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">任务ID</p>
                <p className="text-slate-50 font-mono mt-1">{selectedTask.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">状态</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border mt-1 ${getStatusStyle(selectedTask.status)}`}>
                  {getStatusText(selectedTask.status)}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">待甄别告警</p>
                <p className="text-orange-400 font-bold mt-1">{selectedTask.pendingAlerts}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">已决策数</p>
                <p className="text-green-400 font-bold mt-1">{selectedTask.decidedCount}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedTask(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AlertDecisionView;
