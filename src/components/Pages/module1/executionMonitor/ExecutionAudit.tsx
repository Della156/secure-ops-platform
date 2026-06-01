'use client';

import React, { useState } from 'react';
import { Search, Download, Filter, Calendar, User, FileText, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface ExecutionRecord {
  id: string;
  taskName: string;
  taskId: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  startTime: string;
  endTime: string | null;
  duration: string;
  triggeredBy: string;
}

interface OperationLog {
  id: string;
  time: string;
  user: string;
  action: string;
  target: string;
  result: 'success' | 'failed';
  details: string;
}

const mockExecutionRecords: ExecutionRecord[] = [
  { id: 'REC-001', taskName: '防火墙配置同步', taskId: 'TASK-001', status: 'running', startTime: '2026-06-01 10:30:00', endTime: null, duration: '00:15:32', triggeredBy: '张三' },
  { id: 'REC-002', taskName: '安全基线检查', taskId: 'TASK-002', status: 'success', startTime: '2026-06-01 09:00:00', endTime: '2026-06-01 09:45:23', duration: '00:45:23', triggeredBy: '李四' },
  { id: 'REC-003', taskName: '漏洞扫描任务', taskId: 'TASK-003', status: 'failed', startTime: '2026-06-01 08:00:00', endTime: '2026-06-01 08:12:45', duration: '00:12:45', triggeredBy: '王五' },
  { id: 'REC-004', taskName: '日志分析任务', taskId: 'TASK-004', status: 'success', startTime: '2026-06-01 06:00:00', endTime: '2026-06-01 07:30:15', duration: '01:30:15', triggeredBy: '系统' },
  { id: 'REC-005', taskName: '系统备份任务', taskId: 'TASK-005', status: 'pending', startTime: '-', endTime: null, duration: '-', triggeredBy: '赵六' },
];

const mockOperationLogs: OperationLog[] = [
  { id: 'LOG-001', time: '2026-06-01 10:35:00', user: '张三', action: '启动任务', target: '防火墙配置同步 (TASK-001)', result: 'success', details: '用户手动启动任务' },
  { id: 'LOG-002', time: '2026-06-01 09:45:23', user: '系统', action: '任务完成', target: '安全基线检查 (TASK-002)', result: 'success', details: '任务执行完成' },
  { id: 'LOG-003', time: '2026-06-01 08:12:45', user: '系统', action: '任务失败', target: '漏洞扫描任务 (TASK-003)', result: 'failed', details: '连接超时' },
  { id: 'LOG-004', time: '2026-06-01 07:30:15', user: '系统', action: '任务完成', target: '日志分析任务 (TASK-004)', result: 'success', details: '任务执行完成' },
  { id: 'LOG-005', time: '2026-06-01 06:00:00', user: '系统', action: '启动任务', target: '日志分析任务 (TASK-004)', result: 'success', details: '定时任务触发' },
];

export function ExecutionAudit() {
  const [activeTab, setActiveTab] = useState<'executions' | 'operations'>('executions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const getStatusConfig = (status: string) => {
    const configs = {
      success: { label: '成功', color: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30', icon: CheckCircle2 },
      failed: { label: '失败', color: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30', icon: XCircle },
      running: { label: '运行中', color: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30', icon: Activity },
      pending: { label: '等待', color: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30', icon: FileText },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const filteredExecutions = mockExecutionRecords.filter(record => {
    const matchesSearch = record.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        record.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        record.triggeredBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOperations = mockOperationLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.target.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExport = (type: 'executions' | 'operations') => {
    alert(`正在导出${type === 'executions' ? '执行记录' : '操作日志'}...`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务执行监控与审计</h1>
        <p className="text-[#9CA3AF]">查看任务执行记录和操作日志</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl mb-6">
        <div className="border-b border-[#2A354D]">
          <div className="flex">
            <button
              onClick={() => setActiveTab('executions')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'executions' ? 'text-[#0066FF] border-b-2 border-blue-500' : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
              }`}
            >
              <Activity className="w-4 h-4" />
              执行记录
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'operations' ? 'text-[#0066FF] border-b-2 border-blue-500' : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
              }`}
            >
              <FileText className="w-4 h-4" />
              操作日志
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
                />
              </div>
              {activeTab === 'executions' && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="">全部状态</option>
                  <option value="success">成功</option>
                  <option value="failed">失败</option>
                  <option value="running">运行中</option>
                  <option value="pending">等待</option>
                </select>
              )}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>
            <button
              onClick={() => handleExport(activeTab)}
              className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        {activeTab === 'executions' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#181F32]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">记录ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">任务ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">开始时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">结束时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">耗时</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发人</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredExecutions.map((record) => {
                  const statusConfig = getStatusConfig(record.status);
                  const Icon = statusConfig.icon;

                  return (
                    <tr key={record.id} className="hover:bg-[#181F32]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{record.taskName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.taskId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          <Icon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.startTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.endTime || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{record.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm text-[#D1D5DB]">
                          <User className="w-3.5 h-3.5 text-[#6B7280]" />
                          {record.triggeredBy}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredExecutions.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#6B7280]">暂无数据</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#181F32]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">日志ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">目标</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">结果</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A354D]">
                {filteredOperations.map((log) => {
                  const Icon = log.result === 'success' ? CheckCircle2 : XCircle;
                  const color = log.result === 'success' ? 'text-[#00C853]' : 'text-[#FF3B30]';

                  return (
                    <tr key={log.id} className="hover:bg-[#181F32]/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{log.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{log.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm text-[#D1D5DB]">
                          <User className="w-3.5 h-3.5 text-[#6B7280]" />
                          {log.user}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6]">{log.action}</td>
                      <td className="px-6 py-4 text-sm text-[#D1D5DB]">{log.target}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {log.result === 'success' ? '成功' : '失败'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#9CA3AF]">{log.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredOperations.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#6B7280]">暂无数据</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">上一页</button>
        <button className="px-3 py-1 bg-[#0066FF] text-[#F3F4F6] rounded text-sm">1</button>
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">2</button>
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">3</button>
        <button className="px-3 py-1 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded text-sm transition-colors">下一页</button>
      </div>
    </div>
  );
}
