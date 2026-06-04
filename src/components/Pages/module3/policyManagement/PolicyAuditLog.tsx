'use client';

import { useState } from 'react';
import { Clock, User, Edit3, Search, Filter } from 'lucide-react';

const mockLogs = [
  { id: 'log-001', action: 'create', target: '防火墙规则策略', operator: '管理员', time: '2024-01-15 10:30:22', description: '创建新策略' },
  { id: 'log-002', action: 'update', target: '访问控制策略', operator: '运维人员', time: '2024-01-15 09:15:45', description: '修改策略配置' },
  { id: 'log-003', action: 'delete', target: '旧安全策略', operator: '管理员', time: '2024-01-14 16:22:18', description: '删除过期策略' },
  { id: 'log-004', action: 'enable', target: '数据加密策略', operator: '安全管理员', time: '2024-01-14 14:08:33', description: '启用策略' },
  { id: 'log-005', action: 'disable', target: '测试策略', operator: '管理员', time: '2024-01-13 11:45:00', description: '禁用策略' },
];

const getActionInfo = (action: string) => {
  switch (action) {
    case 'create': return { color: 'text-green-400', bg: 'bg-green-500/20', text: '创建' };
    case 'update': return { color: 'text-blue-400', bg: 'bg-blue-500/20', text: '修改' };
    case 'delete': return { color: 'text-red-400', bg: 'bg-red-500/20', text: '删除' };
    case 'enable': return { color: 'text-green-400', bg: 'bg-green-500/20', text: '启用' };
    case 'disable': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', text: '禁用' };
    default: return { color: 'text-gray-400', bg: 'bg-gray-500/20', text: '未知' };
  }
};

export function PolicyAuditLog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockLogs.filter(log => 
    log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">策略审计日志</h1>
          <p className="text-slate-400 mt-1">追踪策略变更记录</p>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索目标或操作人..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Filter className="w-3.5 h-3.5" />筛选
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111625] text-slate-400 text-xs">
            <tr>
              <th className="text-left px-4 py-2.5">操作类型</th>
              <th className="text-left px-4 py-2.5">目标对象</th>
              <th className="text-left px-4 py-2.5">操作人</th>
              <th className="text-left px-4 py-2.5">操作时间</th>
              <th className="text-left px-4 py-2.5">描述</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => {
              const actionInfo = getActionInfo(log.action);
              return (
                <tr key={log.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded ${actionInfo.bg} ${actionInfo.color}`}>
                      <Edit3 className="w-3 h-3" />
                      {actionInfo.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{log.target}</td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3" />{log.operator}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />{log.time}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{log.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#2A354D] bg-[#111625] text-xs text-slate-400">
          <span>共 {filteredLogs.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300" disabled>‹</button>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded">1</span>
            <button className="px-2 py-0.5 bg-[#2A354D] hover:bg-[#364360] rounded text-slate-300">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}