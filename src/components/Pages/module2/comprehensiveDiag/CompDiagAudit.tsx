'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, User, Server, CheckCircle, XCircle, FileText, Eye, Activity } from 'lucide-react';

interface AuditItem {
  id: string;
  operator: string;
  role: string;
  action: string;
  target: string;
  taskId: string;
  taskName: string;
  time: string;
  ip: string;
  result: 'success' | 'failed';
  details: string;
}

const mockAudit: AuditItem[] = [
  { 
    id: 'AUD-CD-001', 
    operator: '张三', 
    role: '系统管理员', 
    action: '启动诊断任务', 
    target: '数据中心网络设备', 
    taskId: 'CD-001', 
    taskName: '网络系统综合诊断',
    time: '2026-06-02 10:30:00', 
    ip: '192.168.1.100',
    result: 'success',
    details: '用户手动启动网络诊断任务，参数配置正常'
  },
  { 
    id: 'AUD-CD-002', 
    operator: '李四', 
    role: '运维工程师', 
    action: '查看诊断报告', 
    target: '应用服务器集群', 
    taskId: 'CD-002', 
    taskName: '服务器集群健康检查',
    time: '2026-06-02 09:15:00', 
    ip: '192.168.1.101',
    result: 'success',
    details: '查看已完成的诊断任务报告'
  },
  { 
    id: 'AUD-CD-003', 
    operator: '王五', 
    role: 'DBA', 
    action: '下载诊断报告', 
    target: '主数据库集群', 
    taskId: 'CD-003', 
    taskName: '数据库性能诊断',
    time: '2026-06-01 16:30:00', 
    ip: '192.168.1.102',
    result: 'success',
    details: '导出PDF格式的诊断报告'
  },
  { 
    id: 'AUD-CD-004', 
    operator: '赵六', 
    role: '安全工程师', 
    action: '停止诊断任务', 
    target: '防火墙/IDS系统', 
    taskId: 'CD-004', 
    taskName: '安全系统状态检查',
    time: '2026-06-01 14:20:00', 
    ip: '192.168.1.103',
    result: 'success',
    details: '因紧急维护需求手动停止诊断任务'
  },
  { 
    id: 'AUD-CD-005', 
    operator: '系统自动', 
    role: '系统', 
    action: '定时诊断任务', 
    target: 'SAN存储阵列', 
    taskId: 'CD-005', 
    taskName: '存储系统性能诊断',
    time: '2026-06-01 08:00:00', 
    ip: '127.0.0.1',
    result: 'failed',
    details: '定时任务执行失败，连接存储超时'
  },
  { 
    id: 'AUD-CD-006', 
    operator: '钱七', 
    role: '运维主管', 
    action: '修改诊断配置', 
    target: '全局配置', 
    taskId: '-', 
    taskName: '-',
    time: '2026-05-31 18:00:00', 
    ip: '192.168.1.104',
    result: 'success',
    details: '更新了诊断任务的超时时间和重试次数配置'
  },
];

export function CompDiagAudit() {
  const [audit] = useState(mockAudit);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const filteredAudit = audit.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.operator.includes(searchKeyword) || 
      item.taskId.includes(searchKeyword) ||
      item.action.includes(searchKeyword) ||
      item.details.includes(searchKeyword);
    const matchesAction = actionFilter === 'all' || item.action === actionFilter;
    const matchesResult = resultFilter === 'all' || item.result === resultFilter;
    return matchesSearch && matchesAction && matchesResult;
  });

  const uniqueActions = Array.from(new Set(audit.map(item => item.action)));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">综合故障诊断任务审计</h2>
        <p className="text-sm text-gray-400 mt-1">诊断操作日志记录、诊断任务执行审计</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索操作人、任务ID、动作或详情..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部动作</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出日志
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111827]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">角色</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">IP地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">结果</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredAudit.map((item) => (
                <tr key={item.id} className="hover:bg-[#2A354D]/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">{item.operator}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-400">{item.role}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">{item.action}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <Server className="w-4 h-4 text-gray-400" />
                      {item.target}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {item.taskId !== '-' ? (
                      <div>
                        <div className="text-sm text-blue-400">{item.taskId}</div>
                        <div className="text-xs text-gray-500">{item.taskName}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{item.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-400 font-mono">{item.ip}</span>
                  </td>
                  <td className="px-4 py-4">
                    {item.result === 'success' ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        成功
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        失败
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            共 {filteredAudit.length} 条审计记录
          </div>
        </div>
      </div>
    </div>
  );
}
