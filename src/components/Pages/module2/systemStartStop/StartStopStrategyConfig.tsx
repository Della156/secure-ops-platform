'use client';

import { useState, useMemo } from 'react';
import { Settings, Clock, AlertTriangle, Save, Trash2, Edit2, Plus, Play, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

interface Strategy {
  id: string;
  name: string;
  type: 'start' | 'stop' | 'restart';
  targetGroup: string;
  executionOrder: string;
  timeout: string;
  retryCount: number;
  enabled: boolean;
  createdAt: string;
}

const mockData: Strategy[] = [
  { id: 'STR-001', name: '应用服务启动策略', type: 'start', targetGroup: '应用服务器组', executionOrder: '顺序启动', timeout: '300s', retryCount: 2, enabled: true, createdAt: '2026-05-20 10:00' },
  { id: 'STR-002', name: '数据库停止策略', type: 'stop', targetGroup: '数据库服务器组', executionOrder: '并行停止', timeout: '600s', retryCount: 1, enabled: true, createdAt: '2026-05-22 14:00' },
  { id: 'STR-003', name: '缓存集群重启策略', type: 'restart', targetGroup: '缓存服务器组', executionOrder: '滚动重启', timeout: '180s', retryCount: 3, enabled: false, createdAt: '2026-05-25 09:00' },
  { id: 'STR-004', name: '日志服务启动策略', type: 'start', targetGroup: '日志服务器组', executionOrder: '并行启动', timeout: '120s', retryCount: 1, enabled: true, createdAt: '2026-05-28 16:00' },
  { id: 'STR-005', name: '监控服务重启策略', type: 'restart', targetGroup: '监控服务器组', executionOrder: '顺序重启', timeout: '240s', retryCount: 2, enabled: true, createdAt: '2026-06-01 11:00' },
];

export function StartStopStrategyConfig() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const filtered = useMemo(() => mockData.filter(d => 
    !search || d.name.includes(search) || d.targetGroup.includes(search)
  ), [search]);

  const columns = [
    { key: 'id', title: '策略ID', width: '100px' },
    { key: 'name', title: '策略名称' },
    {
      key: 'type', title: '操作类型', width: '100px',
      render: (item: Strategy) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded ${
          item.type === 'start' ? 'bg-green-500/20 text-green-400' :
          item.type === 'stop' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {item.type === 'start' ? '启动' : item.type === 'stop' ? '停止' : '重启'}
        </span>
      ),
    },
    { key: 'targetGroup', title: '目标分组', width: '150px' },
    { key: 'executionOrder', title: '执行顺序', width: '120px' },
    { key: 'timeout', title: '超时时间', width: '100px' },
    { key: 'retryCount', title: '重试次数', width: '100px' },
    {
      key: 'enabled', title: '状态', width: '80px',
      render: (item: Strategy) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded ${
          item.enabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
        }`}>
          {item.enabled ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'actions', title: '操作', width: '150px',
      render: (item: Strategy) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setSelectedStrategy(item)}>
            <Edit2 className="w-3 h-3 mr-1" />编辑
          </Button>
          <Button variant="ghost" size="sm" className="text-red-400" onClick={() => {}}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />系统启停策略配置
            </h2>
            <p className="text-xs text-slate-500 mt-1">管理系统启停的执行策略与参数配置</p>
          </div>
          <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1" />新建策略</Button>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-[#2A354D]">
          <Input placeholder="搜索策略名称或目标分组..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Table columns={columns} data={filtered} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      <Modal open={!!selectedStrategy} onClose={() => setSelectedStrategy(null)} title={selectedStrategy?.name || '编辑策略'} width="max-w-2xl">
        {selectedStrategy && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">策略名称</p>
                <Input defaultValue={selectedStrategy.name} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">操作类型</p>
                <Select
                  value={selectedStrategy.type}
                  onChange={() => {}}
                  options={[
                    { value: 'start', label: '启动' },
                    { value: 'stop', label: '停止' },
                    { value: 'restart', label: '重启' },
                  ]}
                />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">目标分组</p>
                <Input defaultValue={selectedStrategy.targetGroup} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">执行顺序</p>
                <Select
                  value={selectedStrategy.executionOrder}
                  onChange={() => {}}
                  options={[
                    { value: '顺序启动', label: '顺序启动' },
                    { value: '并行启动', label: '并行启动' },
                    { value: '滚动重启', label: '滚动重启' },
                  ]}
                />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">超时时间</p>
                <Input defaultValue={selectedStrategy.timeout} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">重试次数</p>
                <Input type="number" defaultValue={selectedStrategy.retryCount} />
              </div>
            </div>
            <div className="bg-amber-900/30 border border-amber-800/50 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-300">修改策略后需要重新执行任务才能生效</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedStrategy(null)}>取消</Button>
              <Button variant="primary"><Save className="w-3.5 h-3.5 mr-1" />保存</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default StartStopStrategyConfig;