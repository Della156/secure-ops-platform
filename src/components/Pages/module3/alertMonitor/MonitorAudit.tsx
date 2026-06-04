'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, User, FileText, Eye } from 'lucide-react';

interface AuditLog {
  id: string;
  operator: string;
  operationType: 'create' | 'modify' | 'delete' | 'execute';
  operationTime: string;
  target: string;
  content: string;
  ipAddress: string;
}

const mockLogs: AuditLog[] = [
  { id: 'LOG-001', operator: 'admin', operationType: 'create', operationTime: '2026-06-03 14:30:00', target: 'SIEM告警采集任务', content: '创建新的SIEM告警采集任务', ipAddress: '192.168.1.100' },
  { id: 'LOG-002', operator: 'admin', operationType: 'modify', operationTime: '2026-06-03 14:25:00', target: '告警分析规则', content: '修改规则"SQL注入检测"的阈值参数', ipAddress: '192.168.1.100' },
  { id: 'LOG-003', operator: 'user1', operationType: 'execute', operationTime: '2026-06-03 14:20:00', target: '影响范围评估', content: '手动执行影响范围评估任务', ipAddress: '10.0.0.50' },
  { id: 'LOG-004', operator: 'admin', operationType: 'delete', operationTime: '2026-06-03 14:15:00', target: '旧采集配置', content: '删除过期的采集配置', ipAddress: '192.168.1.100' },
  { id: 'LOG-005', operator: 'user2', operationType: 'execute', operationTime: '2026-06-03 14:10:00', target: '告警趋势预测', content: '执行告警趋势预测任务', ipAddress: '172.16.0.200' },
];

export function MonitorAudit() {
  const [logs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [operationFilter, setOperationFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperation = operationFilter === 'all' || log.operationType === operationFilter;
    return matchesSearch && matchesOperation;
  });

  const getOperationTypeText = (type: string) => {
    switch (type) {
      case 'create': return '创建';
      case 'modify': return '修改';
      case 'delete': return '删除';
      case 'execute': return '执行';
      default: return type;
    }
  };

  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-green-400 bg-green-500/20';
      case 'modify': return 'text-blue-400 bg-blue-500/20';
      case 'delete': return 'text-red-400 bg-red-500/20';
      case 'execute': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">告警辅助监测任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">操作日志记录、审计追踪、安全合规检查</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索操作人或目标..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <select 
              value={operationFilter}
              onChange={(e) => setOperationFilter(e.target.value)}
              className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
            >
              <option value="all">全部操作类型</option>
              <option value="create">创建</option>
              <option value="modify">修改</option>
              <option value="delete">删除</option>
              <option value="execute">执行</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              时间筛选
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出日志
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作对象</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作内容</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-gray-300">{log.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white">{log.operator}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getOperationTypeColor(log.operationType)}`}>
                    {getOperationTypeText(log.operationType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{log.operationTime}</td>
                <td className="px-4 py-3 text-sm text-white">{log.target}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{log.content}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{log.ipAddress}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="查看详情">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}