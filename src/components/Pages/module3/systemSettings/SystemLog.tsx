'use client';

import { useState } from 'react';
import { Clock, User, Edit3, Search, Filter, Download } from 'lucide-react';

const mockLogs = [
  { id: 'log-001', action: '登录', user: '管理员', time: '2024-01-15 10:30:22', ip: '192.168.1.100', result: 'success' },
  { id: 'log-002', action: '修改策略', user: '安全管理员', time: '2024-01-15 09:15:45', ip: '192.168.1.101', result: 'success' },
  { id: 'log-003', action: '导出报表', user: '审计人员', time: '2024-01-14 16:22:18', ip: '192.168.1.102', result: 'success' },
  { id: 'log-004', action: '登录失败', user: 'unknown', time: '2024-01-14 14:08:33', ip: '10.0.0.5', result: 'failed' },
  { id: 'log-005', action: '系统重启', user: '管理员', time: '2024-01-13 11:45:00', ip: '192.168.1.100', result: 'success' },
];

const getResultColor = (result: string) => {
  switch (result) {
    case 'success': return 'text-green-400';
    case 'failed': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export function SystemLog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockLogs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">系统日志</h1>
          <p className="text-slate-400 mt-1">查看系统操作日志</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
          <Download className="w-3.5 h-3.5" />导出日志
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索操作或用户..."
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
              <th className="text-left px-4 py-2.5">操作人</th>
              <th className="text-left px-4 py-2.5">IP地址</th>
              <th className="text-left px-4 py-2.5">操作时间</th>
              <th className="text-left px-4 py-2.5">结果</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} className="border-t border-[#2A354D] hover:bg-[#111625]/50">
                <td className="px-4 py-3 text-white font-medium flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  {log.action}
                </td>
                <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3" />{log.user}
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{log.ip}</td>
                <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />{log.time}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${getResultColor(log.result)}`}>
                    {log.result === 'success' ? '成功' : '失败'}
                  </span>
                </td>
              </tr>
            ))}
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