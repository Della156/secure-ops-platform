'use client';

import { useState, useMemo } from 'react';
import { Power, Play, Square, Clock, RefreshCw, Download, Eye, Filter, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/Common/StatusBadge';

interface StartStopTask {
  id: string;
  name: string;
  type: 'start' | 'stop' | 'restart';
  target: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
  lastRun: string;
  scheduledTime: string;
  operator: string;
}

const mockData: StartStopTask[] = [
  { id: 'SS-001', name: '应用服务器重启', type: 'restart', target: 'app-01 ~ app-04', status: 'completed', lastRun: '2026-06-02 03:00', scheduledTime: '每周三 03:00', operator: 'system' },
  { id: 'SS-002', name: '数据库主库维护停止', type: 'stop', target: 'mysql-master-01', status: 'running', lastRun: '2026-06-03 02:00', scheduledTime: '手动触发', operator: 'admin' },
  { id: 'SS-003', name: '缓存集群重启', type: 'restart', target: 'redis-cluster', status: 'pending', lastRun: '2026-05-28 04:00', scheduledTime: '每周六 04:00', operator: 'system' },
  { id: 'SS-004', name: '日志服务启动', type: 'start', target: 'log-server-01', status: 'completed', lastRun: '2026-06-01 08:00', scheduledTime: '每日 08:00', operator: 'system' },
  { id: 'SS-005', name: '监控服务重启', type: 'restart', target: 'monitor-server', status: 'failed', lastRun: '2026-05-25 02:00', scheduledTime: '手动触发', operator: 'admin' },
];

export function SystemStartStopView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<StartStopTask | null>(null);

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
    { key: 'id', title: '任务ID', width: '100px' },
    { key: 'name', title: '任务名称' },
    {
      key: 'type', title: '操作类型', width: '100px',
      render: (item: StartStopTask) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded ${
          item.type === 'start' ? 'bg-green-500/20 text-green-400' :
          item.type === 'stop' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {item.type === 'start' ? '启动' : item.type === 'stop' ? '停止' : '重启'}
        </span>
      ),
    },
    { key: 'target', title: '目标对象', width: '180px' },
    {
      key: 'status', title: '状态', width: '100px',
      render: (item: StartStopTask) => <StatusBadge status={item.status} />,
    },
    { key: 'operator', title: '操作人', width: '100px' },
    { key: 'lastRun', title: '上次执行', width: '160px' },
    {
      key: 'actions', title: '操作', width: '150px',
      render: (item: StartStopTask) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
            <Eye className="w-3 h-3 mr-1" />详情
          </Button>
          {item.status === 'pending' && (
            <Button variant="primary" size="sm">
              <Play className="w-3 h-3 mr-1" />执行
            </Button>
          )}
          {item.status === 'running' && (
            <Button variant="danger" size="sm">
              <Square className="w-3 h-3 mr-1" />停止
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
            <span className="text-blue-400"><Power className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">已完成</span>
            <span className="text-green-400"><Play className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.completed}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">执行中</span>
            <span className="text-blue-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400">失败</span>
            <span className="text-red-400"><Square className="w-4 h-4" /></span>
          </div>
          <div className="text-xl font-semibold text-white">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">系统启停视图</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索任务名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-32">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                { value: 'running', label: '执行中' },
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

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || '任务详情'} width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">任务ID</p>
                <p className="text-slate-50 font-mono mt-1">{selected.id}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">操作类型</p>
                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded mt-1 ${
                  selected.type === 'start' ? 'bg-green-500/20 text-green-400' :
                  selected.type === 'stop' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {selected.type === 'start' ? '启动' : selected.type === 'stop' ? '停止' : '重启'}
                </span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">目标对象</p>
                <p className="text-slate-50 mt-1">{selected.target}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">状态</p>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">操作人</p>
                <p className="text-slate-50 mt-1">{selected.operator}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm">下次执行时间</p>
                <p className="text-slate-50 mt-1">{selected.scheduledTime}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>关闭</Button>
              <Button variant="primary"><Settings className="w-3.5 h-3.5 mr-1" />编辑配置</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SystemStartStopView;