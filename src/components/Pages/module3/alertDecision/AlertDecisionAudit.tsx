'use client';

import { useState } from 'react';
import { FileSearch, Search, Filter, Download, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Select } from '@/components/ui/Select';

interface AuditLog {
  id: string;
  operator: string;
  operation: string;
  time: string;
  target: string;
  content: string;
  ip: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'AUD-001', operator: 'admin', operation: 'create', time: '2024-01-15 10:30:00', target: '决策策略', content: '新增默认阻断策略', ip: '192.168.1.100' },
  { id: 'AUD-002', operator: 'security-admin', operation: 'modify', time: '2024-01-15 10:25:00', target: '决策策略', content: '更新流量清洗策略条件', ip: '192.168.1.101' },
  { id: 'AUD-003', operator: 'system', operation: 'execute', time: '2024-01-15 10:20:00', target: '决策任务', content: '执行告警分析决策任务A', ip: '127.0.0.1' },
  { id: 'AUD-004', operator: 'admin', operation: 'delete', time: '2024-01-15 10:15:00', target: '决策策略', content: '删除旧版忽略策略', ip: '192.168.1.100' },
  { id: 'AUD-005', operator: 'system', operation: 'execute', time: '2024-01-15 10:10:00', target: '处置动作', content: '自动执行阻断操作', ip: '127.0.0.1' },
];

const operationStyle: Record<string, string> = {
  create: 'bg-green-500/20 text-green-400 border-green-500/40',
  modify: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  delete: 'bg-red-500/20 text-red-400 border-red-500/40',
  execute: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
};

const operationTexts: Record<string, string> = {
  create: '创建',
  modify: '修改',
  delete: '删除',
  execute: '执行',
};

export function AlertDecisionAudit() {
  const [searchQuery, setSearchQuery] = useState('');
  const [operationFilter, setOperationFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperation = operationFilter === 'all' || log.operation === operationFilter;
    return matchesSearch && matchesOperation;
  });

  const columns = [
    { key: 'id', title: '日志ID', width: '120px' },
    { key: 'operator', title: '操作人', width: '130px' },
    {
      key: 'operation', title: '操作类型', width: '100px',
      render: (item: AuditLog) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${operationStyle[item.operation] || 'bg-gray-500/20 text-gray-400 border-gray-500/40'}`}>
          {operationTexts[item.operation] || item.operation}
        </span>
      ),
    },
    { key: 'time', title: '操作时间', width: '190px' },
    { key: 'target', title: '操作对象' },
    { key: 'content', title: '操作内容' },
    { key: 'ip', title: 'IP地址', width: '150px' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">告警分析决策任务审计</h1>
          <p className="text-slate-400 mt-1">查看所有操作审计日志，确保安全合规</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4 mr-2" />
          导出审计日志
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="搜索操作人或操作对象..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-32">
          <Select
            value={operationFilter}
            onChange={(e) => setOperationFilter(e.target.value)}
            options={[
              { value: 'all', label: '全部' },
              { value: 'create', label: '创建' },
              { value: 'modify', label: '修改' },
              { value: 'delete', label: '删除' },
              { value: 'execute', label: '执行' },
            ]}
            placeholder="操作类型"
          />
        </div>
        <Button variant="secondary" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          选择日期
        </Button>
        <Button variant="secondary" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          筛选
        </Button>
      </div>

      <Card padding="none">
        <Table
          columns={columns}
          data={filteredLogs}
          rowKey="id"
        />
      </Card>

      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary" size="sm" disabled>上一页</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm">2</Button>
        <Button variant="secondary" size="sm">3</Button>
        <Button variant="secondary" size="sm">下一页</Button>
      </div>
    </div>
  );
}