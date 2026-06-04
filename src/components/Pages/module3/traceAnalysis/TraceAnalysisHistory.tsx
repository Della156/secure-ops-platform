'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Eye, Download, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';

interface TraceHistory {
  id: string;
  name: string;
  status: 'completed' | 'failed';
  startTime: string;
  endTime: string;
  duration: string;
  targetIp: string;
  attackerIp: string;
  iocCount: number;
}

const mockData: TraceHistory[] = [
  { id: 'TRACE-H001', name: 'APT攻击溯源分析', status: 'completed', startTime: '2026-06-02 09:00:00', endTime: '2026-06-02 09:25:15', duration: '25m 15s', targetIp: '192.168.1.100', attackerIp: '45.33.32.156', iocCount: 8 },
  { id: 'TRACE-H002', name: '数据泄露事件溯源', status: 'completed', startTime: '2026-06-01 14:30:00', endTime: '2026-06-01 15:05:00', duration: '35m 00s', targetIp: '10.0.0.50', attackerIp: '91.189.92.10', iocCount: 12 },
  { id: 'TRACE-H003', name: '内部威胁溯源', status: 'completed', startTime: '2026-05-31 16:00:00', endTime: '2026-05-31 16:35:00', duration: '35m 00s', targetIp: '192.168.5.77', attackerIp: '192.168.5.101', iocCount: 5 },
  { id: 'TRACE-H004', name: '钓鱼邮件溯源', status: 'failed', startTime: '2026-05-30 08:00:00', endTime: '2026-05-30 08:08:20', duration: '8m 20s', targetIp: '10.10.10.25', attackerIp: '-', iocCount: 0 },
  { id: 'TRACE-H005', name: '勒索软件传播溯源', status: 'completed', startTime: '2026-05-29 10:00:00', endTime: '2026-05-29 10:45:30', duration: '45m 30s', targetIp: '172.16.0.200', attackerIp: '185.199.111.153', iocCount: 15 },
  { id: 'TRACE-H006', name: 'DDoS攻击溯源', status: 'completed', startTime: '2026-05-28 11:30:00', endTime: '2026-05-28 12:00:00', duration: '30m 00s', targetIp: '192.168.10.1', attackerIp: '多个来源IP', iocCount: 20 },
];

export function TraceAnalysisHistory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<TraceHistory | null>(null);

  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.name.includes(search) && !d.id.includes(search)) return false;
    if (filter !== 'all' && d.status !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: '任务ID', width: '120px' },
    { key: 'name', title: '任务名称' },
    { key: 'targetIp', title: '目标IP', width: '140px' },
    { key: 'attackerIp', title: '攻击者IP', width: '140px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: TraceHistory) => <StatusBadge status={item.status} />,
    },
    { key: 'duration', title: '耗时', width: '100px' },
    { key: 'iocCount', title: 'IOC数量', width: '100px' },
    { key: 'endTime', title: '完成时间', width: '160px' },
    {
      key: 'actions', title: '操作', width: '100px',
      render: (item: TraceHistory) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
          <Eye className="w-3 h-3 mr-1" />详情
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">溯源分析任务历史查询</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索任务名称或ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-32">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                { value: 'completed', label: '已完成' },
                { value: 'failed', label: '失败' },
              ]}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="选择日期" className="pl-10" />
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
        <Button variant="secondary" size="sm">3</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || '任务详情'} width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">任务ID</p>
                <p className="text-slate-50 font-mono mt-1">{selected.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">状态</p>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">目标IP</p>
                <p className="text-slate-50 mt-1">{selected.targetIp}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">攻击者IP</p>
                <p className="text-slate-50 mt-1">{selected.attackerIp}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">开始时间</p>
                <p className="text-slate-50 mt-1">{selected.startTime}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">结束时间</p>
                <p className="text-slate-50 mt-1">{selected.endTime}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">耗时</p>
                <p className="text-slate-50 mt-1">{selected.duration}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">IOC数量</p>
                <p className="text-slate-50 mt-1">{selected.iocCount}</p>
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

export default TraceAnalysisHistory;