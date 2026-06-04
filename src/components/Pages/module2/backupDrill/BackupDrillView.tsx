'use client';

import { useState, useMemo } from 'react';
import { Play, Clock, CheckCircle2, AlertCircle, RefreshCw, Download, Eye, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DrillTask {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  lastRun: string;
  nextRun: string;
  duration: string;
}

const mockData: DrillTask[] = [
  { id: 'DR-001', name: '核心数据库恢复演练', type: '数据库', status: 'completed', lastRun: '2026-06-02 02:00', nextRun: '2026-06-09 02:00', duration: '15m 32s' },
  { id: 'DR-002', name: '全机房断电应急演练', type: '系统', status: 'running', lastRun: '2026-06-01 01:00', nextRun: '-', duration: '8m 15s' },
  { id: 'DR-003', name: '应用双活切换演练', type: '应用', status: 'pending', lastRun: '2026-05-28 03:00', nextRun: '2026-06-04 03:00', duration: '-' },
  { id: 'DR-004', name: '网络隔离演练', type: '网络', status: 'failed', lastRun: '2026-05-25 04:00', nextRun: '2026-06-05 04:00', duration: '5m 48s' },
  { id: 'DR-005', name: '日志系统灾备演练', type: '日志', status: 'completed', lastRun: '2026-06-01 05:00', nextRun: '2026-06-08 05:00', duration: '12m 20s' },
];

const trendData = [
  { time: '00:00', count: 2 },
  { time: '04:00', count: 3 },
  { time: '08:00', count: 5 },
  { time: '12:00', count: 8 },
  { time: '16:00', count: 6 },
  { time: '20:00', count: 4 },
];

export function BackupDrillView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<DrillTask | null>(null);

  const stats = useMemo(() => ({
    total: mockData.length,
    completed: mockData.filter(d => d.status === 'completed').length,
    running: mockData.filter(d => d.status === 'running').length,
    pending: mockData.filter(d => d.status === 'pending').length,
    failed: mockData.filter(d => d.status === 'failed').length,
  }), []);

  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.name.includes(search)) return false;
    if (filter !== 'all' && d.status !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: '演练ID', width: '120px' },
    { key: 'name', title: '演练名称' },
    { key: 'type', title: '演练类型', width: '100px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: DrillTask) => <StatusBadge status={item.status} />,
    },
    { key: 'lastRun', title: '上次执行', width: '160px' },
    { key: 'duration', title: '执行时长', width: '100px' },
    { key: 'nextRun', title: '下次执行', width: '160px' },
    {
      key: 'actions', title: '操作', width: '120px',
      render: (item: DrillTask) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
          <Eye className="w-3.5 h-3.5 mr-1" />详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">总演练数</span>
            <span className="text-blue-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.total}</div>
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
            <span className="text-xs text-slate-400">进行中</span>
            <span className="text-blue-400"><Play className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">待执行</span>
            <span className="text-yellow-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.pending}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">失败</span>
            <span className="text-red-400"><AlertCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.failed}</div>
        </div>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-white mb-3">演练趋势（24h）</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="time" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#111625', border: '1px solid #2A354D', borderRadius: 6 }} />
            <Line type="monotone" dataKey="count" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">备份恢复演练视图</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索演练名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || '演练详情'} width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">演练ID</p>
                <p className="text-slate-50 font-mono mt-1">{selected.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">演练类型</p>
                <p className="text-slate-50 mt-1">{selected.type}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">状态</p>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">执行时长</p>
                <p className="text-slate-50 mt-1">{selected.duration}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 col-span-2">
                <p className="text-slate-400 text-sm">上次执行时间</p>
                <p className="text-slate-50 mt-1">{selected.lastRun}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 col-span-2">
                <p className="text-slate-400 text-sm">下次执行时间</p>
                <p className="text-slate-50 mt-1">{selected.nextRun}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BackupDrillView;