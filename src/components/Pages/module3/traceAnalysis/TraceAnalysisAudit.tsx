'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Download, RefreshCw, User, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface AuditLog {
  id: string;
  operator: string;
  operationType: 'create' | 'modify' | 'delete' | 'execute';
  operationTime: string;
  target: string;
  content: string;
  ip: string;
}

const mockData: AuditLog[] = [
  { id: 'AUD-001', operator: 'admin', operationType: 'create', operationTime: '2026-06-03 10:30:00', target: 'TRACE-001', content: '创建溯源分析任务', ip: '192.168.1.10' },
  { id: 'AUD-002', operator: 'admin', operationType: 'execute', operationTime: '2026-06-03 10:30:15', target: 'TRACE-001', content: '开始执行溯源分析', ip: '192.168.1.10' },
  { id: 'AUD-003', operator: 'system', operationType: 'modify', operationTime: '2026-06-03 10:42:30', target: 'TRACE-001', content: '更新任务进度: 30%', ip: '10.0.0.1' },
  { id: 'AUD-004', operator: 'system', operationType: 'modify', operationTime: '2026-06-03 10:48:00', target: 'TRACE-001', content: '更新任务进度: 60%', ip: '10.0.0.1' },
  { id: 'AUD-005', operator: 'admin', operationType: 'create', operationTime: '2026-06-03 11:00:00', target: 'TRACE-002', content: '创建溯源分析任务', ip: '192.168.1.10' },
  { id: 'AUD-006', operator: 'system', operationType: 'modify', operationTime: '2026-06-03 11:15:00', target: 'TRACE-001', content: '任务完成', ip: '10.0.0.1' },
  { id: 'AUD-007', operator: 'user1', operationType: 'execute', operationTime: '2026-06-03 11:30:00', target: 'TRACE-003', content: '查看溯源报告', ip: '172.16.0.50' },
  { id: 'AUD-008', operator: 'admin', operationType: 'delete', operationTime: '2026-06-03 12:00:00', target: 'TRACE-H004', content: '删除历史任务记录', ip: '192.168.1.10' },
];

export function TraceAnalysisAudit() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => mockData.filter(d => {
    if (search && !d.target.includes(search) && !d.operator.includes(search)) return false;
    if (filter !== 'all' && d.operationType !== filter) return false;
    return true;
  }), [search, filter]);

  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'create': return { label: '创建', className: 'bg-blue-500/20 text-blue-400' };
      case 'modify': return { label: '修改', className: 'bg-yellow-500/20 text-yellow-400' };
      case 'delete': return { label: '删除', className: 'bg-red-500/20 text-red-400' };
      case 'execute': return { label: '执行', className: 'bg-green-500/20 text-green-400' };
      default: return { label: type, className: 'bg-slate-500/20 text-slate-400' };
    }
  };

  const columns = [
    { key: 'id', title: '日志ID', width: '100px' },
    {
      key: 'operator', title: '操作人', width: '100px',
      render: (item: AuditLog) => (
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>{item.operator}</span>
        </div>
      ),
    },
    {
      key: 'operationType', title: '操作类型', width: '100px',
      render: (item: AuditLog) => {
        const op = getOperationTypeLabel(item.operationType);
        return <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded ${op.className}`}>{op.label}</span>;
      },
    },
    { key: 'target', title: '操作对象', width: '120px' },
    { key: 'content', title: '操作内容' },
    {
      key: 'operationTime', title: '操作时间', width: '160px',
      render: (item: AuditLog) => (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm">{item.operationTime}</span>
        </div>
      ),
    },
    { key: 'ip', title: 'IP地址', width: '140px' },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">溯源分析任务审计</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="搜索操作对象或操作人..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="w-32">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: '全部' },
                { value: 'create', label: '创建' },
                { value: 'modify', label: '修改' },
                { value: 'delete', label: '删除' },
                { value: 'execute', label: '执行' },
              ]}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="选择日期" className="pl-10" />
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
          <Button size="sm"><Download className="w-3.5 h-3.5 mr-1" />导出审计日志</Button>
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

export default TraceAnalysisAudit;