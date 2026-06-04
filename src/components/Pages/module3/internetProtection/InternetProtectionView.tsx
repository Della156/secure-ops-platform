'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, Globe, Activity, Search, Filter, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

const mockTasks = [
  { id: 'IPM-001', name: '边界防护监测任务', status: 'running', attackEvents: 156, sourceIps: 45, highRiskEvents: 12, startTime: '2024-01-15 08:00:00' },
  { id: 'IPM-002', name: '外网威胁监测', status: 'running', attackEvents: 89, sourceIps: 23, highRiskEvents: 5, startTime: '2024-01-15 08:00:00' },
  { id: 'IPM-003', name: 'DDoS攻击防护', status: 'completed', attackEvents: 2341, sourceIps: 156, highRiskEvents: 45, startTime: '2024-01-14 08:00:00' },
  { id: 'IPM-004', name: '入侵检测监测', status: 'running', attackEvents: 67, sourceIps: 18, highRiskEvents: 8, startTime: '2024-01-15 08:00:00' },
  { id: 'IPM-005', name: 'Web应用防护', status: 'failed', attackEvents: 0, sourceIps: 0, highRiskEvents: 0, startTime: '2024-01-15 08:00:00' },
  { id: 'IPM-006', name: '恶意软件拦截', status: 'running', attackEvents: 34, sourceIps: 12, highRiskEvents: 3, startTime: '2024-01-15 08:00:00' },
];

const mockAttackStats = [
  { type: 'DDoS攻击', count: 1250, percentage: 45 },
  { type: 'SQL注入', count: 456, percentage: 16 },
  { type: 'XSS攻击', count: 342, percentage: 12 },
  { type: '端口扫描', count: 567, percentage: 20 },
  { type: '其他', count: 195, percentage: 7 },
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

export function InternetProtectionView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<typeof mockTasks[0] | null>(null);

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTasks = mockTasks.length;
  const totalAttackEvents = mockTasks.reduce((sum, task) => sum + task.attackEvents, 0);
  const totalSourceIps = mockTasks.reduce((sum, task) => sum + task.sourceIps, 0);
  const totalHighRiskEvents = mockTasks.reduce((sum, task) => sum + task.highRiskEvents, 0);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    {
      key: 'status', title: '监测状态', width: '100px',
      render: (item: typeof mockTasks[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    { key: 'attackEvents', title: '攻击事件数', width: '110px' },
    { key: 'sourceIps', title: '攻击源IP数', width: '110px' },
    { key: 'highRiskEvents', title: '高危事件数', width: '110px', render: (item: typeof mockTasks[0]) => <span className="text-red-400 font-mono">{item.highRiskEvents}</span> },
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
          <h1 className="text-2xl font-bold text-slate-50">互联网防护监测视图</h1>
          <p className="text-slate-400 mt-1">实时监测边界安全态势，自动预测攻击意图</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-2" />导出列表
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">总监测任务</p>
              <p className="text-2xl font-bold text-slate-50 mt-1">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">边界攻击事件数</p>
              <p className="text-2xl font-bold text-slate-50 mt-1">{totalAttackEvents}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">攻击源IP数</p>
              <p className="text-2xl font-bold text-slate-50 mt-1">{totalSourceIps}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">高危事件数</p>
              <p className="text-2xl font-bold text-slate-50 mt-1">{totalHighRiskEvents}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">攻击态势概览</h3>
          <div className="space-y-3">
            {mockAttackStats.map((stat) => (
              <div key={stat.type} className="flex items-center">
                <span className="w-32 text-slate-400 text-sm">{stat.type}</span>
                <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${stat.percentage}%` }} />
                </div>
                <span className="w-16 text-right text-slate-300 text-sm">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

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
        <Button variant="secondary" size="sm"><Filter className="w-4 h-4 mr-2" />筛选</Button>
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

      <Modal open={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.name || '任务详情'} width="max-w-2xl">
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
                <p className="text-slate-400 text-sm">攻击事件数</p>
                <p className="text-slate-50 mt-1">{selectedTask.attackEvents}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">攻击源IP数</p>
                <p className="text-slate-50 mt-1">{selectedTask.sourceIps}</p>
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

export default InternetProtectionView;
