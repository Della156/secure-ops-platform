'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Send, Settings, RefreshCw, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/Common/StatusBadge';

interface ElinkTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  target: string;
  messageCount: number;
  sendTime: string;
  duration: string;
}

const mockData: ElinkTask[] = [
  { id: 'ELK-001', name: '安全告警协同推送', status: 'running', target: '省级平台', messageCount: 15, sendTime: '2026-06-03 09:00', duration: '5m 30s' },
  { id: 'ELK-002', name: '威胁情报共享', status: 'completed', target: '市级平台A', messageCount: 8, sendTime: '2026-06-02 14:00', duration: '2m 15s' },
  { id: 'ELK-003', name: '事件协查请求', status: 'pending', target: '市级平台B', messageCount: 0, sendTime: '-', duration: '-' },
  { id: 'ELK-004', name: '攻击溯源信息同步', status: 'completed', target: '省级平台', messageCount: 12, sendTime: '2026-06-01 10:00', duration: '3m 45s' },
  { id: 'ELK-005', name: '应急响应通知', status: 'failed', target: '市级平台C', messageCount: 3, sendTime: '2026-06-03 08:00', duration: '1m 20s' },
];

export function ElinkView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const stats = useMemo(() => ({
    total: mockData.length,
    running: mockData.filter(d => d.status === 'running').length,
    completed: mockData.filter(d => d.status === 'completed').length,
    totalMessages: mockData.reduce((sum, d) => sum + d.messageCount, 0),
  }), []);

  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.name.includes(search)) return false;
    if (filter !== 'all' && d.status !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    { key: 'target', title: '目标平台', width: '120px' },
    { key: 'messageCount', title: '消息数', width: '100px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: ElinkTask) => <StatusBadge status={item.status} />,
    },
    { key: 'duration', title: '耗时', width: '100px' },
    {
      key: 'actions', title: '操作', width: '100px',
      render: (item: ElinkTask) => (
        <Button variant="ghost" size="sm">
          <Send className="w-3 h-3 mr-1" />发送
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">协同任务数</span>
            <span className="text-blue-400">🔗</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">运行中</span>
            <span className="text-green-400">▶️</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">已完成</span>
            <span className="text-green-400">✓</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.completed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">消息总数</span>
            <span className="text-blue-400">📤</span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.totalMessages}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">ELINK协同联动视图</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索任务名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-32">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                { value: 'running', label: '进行中' },
                { value: 'completed', label: '已完成' },
                { value: 'pending', label: '待执行' },
                { value: 'failed', label: '失败' },
              ]}
            />
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
          <Button size="sm"><Download className="w-3.5 h-3.5 mr-1" />导出</Button>
        </div>
      </div>

      <Card padding="none">
        <Table columns={columns} data={filtered} rowKey="id" />
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

export default ElinkView;