'use client';

import { useState } from 'react';
import { Network, Database, Shield, Plus, Edit2, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

const mockDataSources = [
  { id: 'DS-001', name: '防火墙日志', type: 'firewall', status: 'connected', lastSync: '2024-01-15 10:30:00', syncCount: 12580 },
  { id: 'DS-002', name: 'WAF防护日志', type: 'waf', status: 'connected', lastSync: '2024-01-15 10:28:00', syncCount: 8920 },
  { id: 'DS-003', name: 'IPS告警日志', type: 'ips', status: 'connected', lastSync: '2024-01-15 10:25:00', syncCount: 5670 },
  { id: 'DS-004', name: '威胁情报源', type: 'threat_intel', status: 'connected', lastSync: '2024-01-15 10:00:00', syncCount: 2340 },
  { id: 'DS-005', name: 'DNS日志', type: 'dns', status: 'disconnected', lastSync: '2024-01-15 09:00:00', syncCount: 0 },
];

const mockAttackTop = [
  { rank: 1, source: '192.168.1.100', attacks: 156, country: '中国', region: '北京' },
  { rank: 2, source: '10.0.0.50', attacks: 98, country: '美国', region: '弗吉尼亚' },
  { rank: 3, source: '172.16.0.25', attacks: 76, country: '俄罗斯', region: '莫斯科' },
  { rank: 4, source: '192.168.2.150', attacks: 65, country: '中国', region: '上海' },
  { rank: 5, source: '10.5.0.30', attacks: 45, country: '韩国', region: '首尔' },
];

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = { firewall: '防火墙', waf: 'WAF', ips: 'IPS', threat_intel: '威胁情报', dns: 'DNS' };
  return labels[type] || type;
};

const getStatusStyle = (status: string) => status === 'connected'
  ? 'bg-green-500/20 text-green-400 border-green-500/40'
  : 'bg-red-500/20 text-red-400 border-red-500/40';

const getStatusIcon = (status: string) => status === 'connected'
  ? <CheckCircle className="w-3 h-3 mr-1" />
  : <XCircle className="w-3 h-3 mr-1" />;

const getStatusText = (status: string) => status === 'connected' ? '已连接' : '已断开';

const getRankStyle = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500/20 text-yellow-400';
  if (rank === 2) return 'bg-slate-500/20 text-slate-400';
  if (rank === 3) return 'bg-orange-500/20 text-orange-400';
  return 'bg-slate-700/50 text-slate-300';
};

export function BoundaryInfoIntegration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState('firewall');

  const filteredSources = mockDataSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'id', title: '数据源ID', width: '120px' },
    { key: 'name', title: '数据源名称' },
    { key: 'type', title: '类型', width: '100px', render: (item: typeof mockDataSources[0]) => getTypeLabel(item.type) },
    {
      key: 'status', title: '连接状态', width: '120px',
      render: (item: typeof mockDataSources[0]) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(item.status)}`}>
          {getStatusIcon(item.status)}
          {getStatusText(item.status)}
        </span>
      ),
    },
    { key: 'lastSync', title: '最后同步时间', width: '180px' },
    { key: 'syncCount', title: '同步记录数', width: '120px', render: (item: typeof mockDataSources[0]) => <span className="text-slate-300 font-mono">{item.syncCount.toLocaleString()}</span> },
    {
      key: 'actions', title: '操作', width: '150px',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">边界信息整合</h1>
          <p className="text-slate-400 mt-1">整合防火墙、WAF、IPS等边界设备日志与威胁情报</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />新增数据源
        </Button>
      </div>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">攻击来源TOP 5</h3>
          <div className="space-y-3">
            {mockAttackTop.map((item) => (
              <div key={item.rank} className="flex items-center bg-slate-800/50 rounded-lg p-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankStyle(item.rank)}`}>
                  {item.rank}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-slate-50 font-mono">{item.source}</p>
                  <p className="text-slate-400 text-sm">{item.country} - {item.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold">{item.attacks}</p>
                  <p className="text-slate-500 text-xs">攻击次数</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="relative max-w-md">
        <Network className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="搜索数据源..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card padding="none">
        <Table columns={columns} data={filteredSources} rowKey="id" />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>

      {/* 新增数据源 */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="新增数据源配置" width="max-w-lg">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">数据源名称</label>
            <Input />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">数据源类型</label>
            <Select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              options={[
                { value: 'firewall', label: '防火墙' },
                { value: 'waf', label: 'WAF' },
                { value: 'ips', label: 'IPS' },
                { value: 'threat_intel', label: '威胁情报' },
                { value: 'dns', label: 'DNS' },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">连接地址</label>
            <Input placeholder="http://..." />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#D1D5DB]">认证密钥</label>
            <Input type="password" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>取消</Button>
            <Button variant="primary" onClick={() => setShowAddModal(false)}>保存配置</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BoundaryInfoIntegration;
