'use client';

import { useState } from 'react';
import { Play, Plus, TrendingUp, Shield, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

const mockTasks = [
  { id: 'SO-001', name: '安全编排任务A', status: 'running', trigger: '定时触发', lastRun: '5分钟前', nextRun: '1小时后', runs: 120, successRate: 98 },
  { id: 'SO-002', name: '安全编排任务B', status: 'completed', trigger: '告警触发', lastRun: '30分钟前', nextRun: '-', runs: 256, successRate: 95 },
  { id: 'SO-003', name: '安全编排任务C', status: 'pending', trigger: '手动触发', lastRun: '2小时前', nextRun: '-', runs: 89, successRate: 100 },
  { id: 'SO-004', name: '安全编排任务D', status: 'running', trigger: '定时触发', lastRun: '1分钟前', nextRun: '30分钟后', runs: 42, successRate: 92 },
];

const mockStats = [
  { label: '运行中任务', value: '2', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/20' },
  { label: '编排规则数', value: '15', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { label: '今日执行', value: '47', icon: Play, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { label: '成功率', value: '96%', icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'running': return '运行中';
    case 'completed': return '已完成';
    case 'pending': return '待执行';
    default: return status;
  }
};

export function SecurityOrchestrationView() {
  const [selectedTask, setSelectedTask] = useState<typeof mockTasks[0] | null>(null);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    { key: 'trigger', title: '触发方式' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: typeof mockTasks[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    { key: 'lastRun', title: '上次执行', width: '120px' },
    { key: 'nextRun', title: '下次执行', width: '120px' },
    { key: 'runs', title: '执行次数', width: '100px' },
    {
      key: 'successRate', title: '成功率', width: '100px',
      render: (item: typeof mockTasks[0]) => (
        <span className={item.successRate >= 95 ? 'text-green-400' : 'text-yellow-400'}>{item.successRate}%</span>
      ),
    },
    {
      key: 'actions', title: '操作', width: '100px',
      render: (item: typeof mockTasks[0]) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedTask(item)}>查看详情</Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全编排处置视图</h1>
          <p className="text-slate-400 mt-1">编排安全处置流程，实现自动化响应</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />新建编排任务
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-slate-500">查看详情</span>
            </div>
            <p className="text-2xl font-bold text-slate-50 mt-3">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">编排任务列表</h3>
          <Table columns={columns} data={mockTasks} rowKey="id" />
        </div>
      </Card>

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
                <p className="text-slate-400 text-sm">触发方式</p>
                <p className="text-slate-50 mt-1">{selectedTask.trigger}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">成功率</p>
                <p className={`mt-1 ${selectedTask.successRate >= 95 ? 'text-green-400' : 'text-yellow-400'}`}>{selectedTask.successRate}%</p>
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

export default SecurityOrchestrationView;
