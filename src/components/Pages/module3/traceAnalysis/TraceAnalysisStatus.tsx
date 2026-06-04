'use client';

import { useState, useMemo } from 'react';
import { Activity, CheckCircle2, AlertCircle, Clock, RefreshCw, Eye, Play, Square } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/Common/StatusBadge';

interface TraceTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  duration: string;
  startTime: string;
  targetIp: string;
}

const mockData: TraceTask[] = [
  { id: 'TRACE-001', name: 'APT攻击溯源分析', status: 'running', progress: 65, duration: '12m 30s', startTime: '2026-06-03 09:00:00', targetIp: '192.168.1.100' },
  { id: 'TRACE-002', name: '数据泄露事件溯源', status: 'completed', progress: 100, duration: '25m 15s', startTime: '2026-06-02 14:30:00', targetIp: '10.0.0.50' },
  { id: 'TRACE-003', name: '横向移动追踪', status: 'pending', progress: 0, duration: '-', startTime: '-', targetIp: '172.16.0.88' },
  { id: 'TRACE-004', name: '恶意软件传播路径分析', status: 'running', progress: 30, duration: '5m 45s', startTime: '2026-06-03 10:15:00', targetIp: '192.168.2.200' },
  { id: 'TRACE-005', name: '钓鱼邮件溯源', status: 'failed', progress: 20, duration: '8m 20s', startTime: '2026-06-03 08:00:00', targetIp: '10.10.10.25' },
  { id: 'TRACE-006', name: '内部威胁溯源', status: 'completed', progress: 100, duration: '35m 00s', startTime: '2026-06-01 16:00:00', targetIp: '192.168.5.77' },
];

export function TraceAnalysisStatus() {
  const [selectedTask, setSelectedTask] = useState<TraceTask | null>(null);

  const stats = useMemo(() => ({
    total: mockData.length,
    running: mockData.filter(d => d.status === 'running').length,
    completed: mockData.filter(d => d.status === 'completed').length,
    pending: mockData.filter(d => d.status === 'pending').length,
    failed: mockData.filter(d => d.status === 'failed').length,
  }), []);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    { key: 'targetIp', title: '目标IP', width: '140px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: TraceTask) => <StatusBadge status={item.status} />,
    },
    {
      key: 'progress', title: '进度', width: '120px',
      render: (item: TraceTask) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${item.progress}%` }} />
          </div>
          <span className="text-xs text-slate-400 w-10 text-right">{item.progress}%</span>
        </div>
      ),
    },
    { key: 'duration', title: '耗时', width: '100px' },
    {
      key: 'actions', title: '操作', width: '180px',
      render: (item: TraceTask) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTask(item)}>
            <Eye className="w-3 h-3 mr-1" />详情
          </Button>
          {item.status === 'running' && (
            <Button variant="danger" size="sm">
              <Square className="w-3 h-3 mr-1" />暂停
            </Button>
          )}
          {item.status === 'pending' && (
            <Button variant="primary" size="sm">
              <Play className="w-3 h-3 mr-1" />开始
            </Button>
          )}
          {item.status === 'failed' && (
            <Button variant="secondary" size="sm">
              <RefreshCw className="w-3 h-3 mr-1" />重试
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">总任务数</span>
            <span className="text-blue-400"><Activity className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">进行中</span>
            <span className="text-blue-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">已完成</span>
            <span className="text-green-400"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.completed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">失败</span>
            <span className="text-red-400"><AlertCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">溯源分析任务状态监控</h2>
            <p className="text-xs text-slate-500 mt-1">实时监控溯源分析任务执行状态</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新状态</Button>
        </div>
      </div>

      <Card padding="none">
        <Table columns={columns} data={mockData} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>
    </div>
  );
}

export default TraceAnalysisStatus;