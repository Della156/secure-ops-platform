'use client';

import { useState } from 'react';
import { Search, Filter, Download, Calendar } from 'lucide-react';

const mockAuditLogs = [
  { id: 'AUD-SO-001', operator: 'admin', operation: 'create', time: '2024-01-15 10:30:00', target: '编排规则', content: '新增安全编排规则', ip: '192.168.1.100' },
  { id: 'AUD-SO-002', operator: 'admin', operation: 'modify', time: '2024-01-15 10:25:00', target: '编排规则', content: '修改规则优先级', ip: '192.168.1.100' },
  { id: 'AUD-SO-003', operator: 'system', operation: 'execute', time: '2024-01-15 10:20:00', target: '编排任务', content: '执行安全编排任务A', ip: '127.0.0.1' },
  { id: 'AUD-SO-004', operator: 'admin', operation: 'delete', time: '2024-01-15 10:15:00', target: '编排规则', content: '删除旧版规则', ip: '192.168.1.100' },
  { id: 'AUD-SO-005', operator: 'system', operation: 'execute', time: '2024-01-15 10:10:00', target: '处置动作', content: '自动执行阻断操作', ip: '127.0.0.1' },
];

const getOperationColor = (operation: string) => {
  const colors: Record<string, string> = {
    create: 'bg-green-500/20 text-green-400',
    modify: 'bg-blue-500/20 text-blue-400',
    delete: 'bg-red-500/20 text-red-400',
    execute: 'bg-yellow-500/20 text-yellow-400',
  };
  return colors[operation] || 'bg-gray-500/20 text-gray-400';
};

const getOperationText = (operation: string) => {
  const texts: Record<string, string> = {
    create: '创建',
    modify: '修改',
    delete: '删除',
    execute: '执行',
  };
  return texts[operation] || operation;
};

export function OrchestrationAudit() {
  const [searchQuery, setSearchQuery] = useState('');
  const [operationFilter, setOperationFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperation = operationFilter === 'all' || log.operation === operationFilter;
    return matchesSearch && matchesOperation;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">编排任务审计</h1>
          <p className="text-slate-400 mt-1">查看所有编排操作审计日志，确保安全合规</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
          <Download className="w-3.5 h-3.5" />导出审计日志
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索操作人或操作对象..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <select value={operationFilter} onChange={e => setOperationFilter(e.target.value)} className="px-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md">
            <option value="all">全部操作</option>
            <option value="create">创建</option>
            <option value="modify">修改</option>
            <option value="delete">删除</option>
            <option value="execute">执行</option>
          </select>
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Calendar className="w-3.5 h-3.5" />选择日期
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">日志ID</th>
              <th className="text-left px-4 py-2.5">操作人</th>
              <th className="text-left px-4 py-2.5">操作类型</th>
              <th className="text-left px-4 py-2.5">操作时间</th>
              <th className="text-left px-4 py-2.5">操作对象</th>
              <th className="text-left px-4 py-2.5">操作内容</th>
              <th className="text-left px-4 py-2.5">IP地址</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">{log.id}</td>
                <td className="px-4 py-3 text-slate-50">{log.operator}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getOperationColor(log.operation)}`}>
                    {getOperationText(log.operation)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{log.time}</td>
                <td className="px-4 py-3 text-slate-300">{log.target}</td>
                <td className="px-4 py-3 text-slate-300">{log.content}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filteredLogs.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300" disabled>‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">2</button>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">3</button>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}