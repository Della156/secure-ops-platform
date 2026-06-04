'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Eye, Clock, Filter, ArrowUpDown } from 'lucide-react';

interface AuditRecord {
  id: string;
  time: string;
  operator: string;
  action: string;
  target: string;
  beforeValue?: string;
  afterValue?: string;
  ip: string;
}

export function PermissionAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const auditRecords: AuditRecord[] = [
    { id: 'PA-001', time: '2026-06-04 10:35:23', operator: 'admin', action: '授权', target: '安全管理员', afterValue: '新增数据权限', ip: '192.168.1.100' },
    { id: 'PA-002', time: '2026-06-04 10:30:15', operator: 'admin', action: '撤销', target: '普通用户', beforeValue: '系统配置权限', ip: '192.168.1.100' },
    { id: 'PA-003', time: '2026-06-04 09:45:45', operator: 'user01', action: '修改', target: '运维管理员', beforeValue: '只读权限', afterValue: '读写权限', ip: '192.168.1.105' },
    { id: 'PA-004', time: '2026-06-04 09:20:00', operator: 'admin', action: '授权', target: '审计员', afterValue: '日志查看权限', ip: '192.168.1.100' },
    { id: 'PA-005', time: '2026-06-04 08:15:32', operator: 'user02', action: '查询', target: '权限报表', ip: '192.168.1.108' },
    { id: 'PA-006', time: '2026-06-03 16:45:18', operator: 'admin', action: '批量授权', target: '安全分析部', afterValue: '威胁情报权限', ip: '192.168.1.100' },
    { id: 'PA-007', time: '2026-06-03 14:30:00', operator: 'admin', action: '创建角色', target: '数据分析师', ip: '192.168.1.100' },
    { id: 'PA-008', time: '2026-06-03 10:15:22', operator: 'user01', action: '删除角色', target: '测试角色', beforeValue: '测试角色', ip: '192.168.1.105' },
  ];

  const filteredRecords = auditRecords.filter(record =>
    record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">权限审计</h2>
          <p className="text-sm text-gray-400 mt-1">实现用户-角色-权限授权关系查询与审计</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-1.5">
          <Download className="w-4 h-4" />
          导出报表
        </button>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索操作或目标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input type="date" className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" />
            <span className="text-gray-500">至</span>
            <input type="date" className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <select className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm">
              <option>全部操作人</option>
              <option>admin</option>
              <option>user01</option>
              <option>user02</option>
            </select>
          </div>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-2 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">8</div>
          <div className="text-xs text-gray-500 mt-1">今日审计记录</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">2</div>
          <div className="text-xs text-gray-500 mt-1">授权操作</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">3</div>
          <div className="text-xs text-gray-500 mt-1">修改操作</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">3</div>
          <div className="text-xs text-gray-500 mt-1">操作人数</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">
                <button onClick={() => handleSort('time')} className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  时间
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作人</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">目标对象</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">变更内容</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">来源IP</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 text-sm text-gray-300">{record.time}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{record.operator}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    record.action === '授权' ? 'bg-green-500/20 text-green-400' :
                    record.action === '撤销' ? 'bg-red-500/20 text-red-400' :
                    record.action === '修改' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {record.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{record.target}</td>
                <td className="px-4 py-3">
                  <div className="text-xs">
                    {record.beforeValue && (
                      <div className="text-gray-500 line-through">{record.beforeValue}</div>
                    )}
                    {record.afterValue && (
                      <div className="text-green-400">{record.afterValue}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 font-mono">{record.ip}</td>
                <td className="px-4 py-3">
                  <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredRecords.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionAudit;