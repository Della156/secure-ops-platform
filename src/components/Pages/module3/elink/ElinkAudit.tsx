'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, User, Clock, RefreshCw, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AuditLog {
  id: string;
  operator: string;
  operation: string;
  target: string;
  content: string;
  time: string;
  ip: string;
}

const mockData: AuditLog[] = [
  { id: 'AUD-001', operator: 'admin', operation: '发送告警', target: 'ELK-001', content: '向省级平台发送安全告警', time: '2026-06-03 09:00:00', ip: '192.168.1.100' },
  { id: 'AUD-002', operator: 'admin', operation: '配置修改', target: 'ELINK配置', content: '新增市级平台C连接配置', time: '2026-06-03 08:30:00', ip: '192.168.1.100' },
  { id: 'AUD-003', operator: 'system', operation: '消息同步', target: 'ELK-002', content: '威胁情报消息同步完成', time: '2026-06-02 14:02:15', ip: '127.0.0.1' },
  { id: 'AUD-004', operator: 'user1', operation: '查看日志', target: 'ELINK日志', content: '查看ELINK协同联动日志', time: '2026-06-02 10:00:00', ip: '192.168.1.101' },
];

export function ElinkAudit() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => mockData.filter(item => {
    if (search && !item.content.includes(search) && !item.target.includes(search)) return false;
    if (filter !== 'all' && item.operation !== filter) return false;
    return true;
  }), [search, filter]);

  const columns = [
    { key: 'id', title: '日志ID', width: '100px' },
    {
      key: 'operator', title: '操作人', width: '100px',
      render: (item: AuditLog) => (
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-blue-400" />
          <span>{item.operator}</span>
        </div>
      ),
    },
    { key: 'operation', title: '操作类型', width: '100px' },
    { key: 'target', title: '操作目标', width: '120px' },
    { key: 'content', title: '操作内容' },
    {
      key: 'time', title: '操作时间', width: '160px',
      render: (item: AuditLog) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs">{item.time}</span>
        </div>
      ),
    },
    { key: 'ip', title: '来源IP', width: '120px' },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ELINK协同联动任务审计</h2>
            <p className="text-xs text-slate-500 mt-1">记录和审计ELINK协同联动任务的操作日志</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="搜索操作内容或目标..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="w-36">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: '全部' },
              { value: '发送告警', label: '发送告警' },
              { value: '配置修改', label: '配置修改' },
              { value: '消息同步', label: '消息同步' },
              { value: '查看日志', label: '查看日志' },
            ]}
          />
        </div>
        <Button size="sm"><Download className="w-3.5 h-3.5 mr-1" />导出日志</Button>
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

export default ElinkAudit;