'use client';

import React, { useState } from 'react';
import { Activity, Bell, Clock, AlertTriangle, CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';

interface AuditTask {
  id: string;
  name: string;
  applicant: string;
  applyTime: string;
  status: 'pending' | 'auditing' | 'approved' | 'rejected' | 'timeout';
  auditor: string | null;
  auditTime: string | null;
  priority: 'high' | 'medium' | 'low';
  waitingTime: number;
}

const mockTasks: AuditTask[] = [
  { id: 'AUD-001', name: '核心数据库备份', applicant: '张三', applyTime: '2026-06-02 10:30:00', status: 'pending', auditor: null, auditTime: null, priority: 'high', waitingTime: 45 },
  { id: 'AUD-002', name: '应用服务器重启', applicant: '李四', applyTime: '2026-06-02 09:15:00', status: 'auditing', auditor: '审核员A', auditTime: '2026-06-02 10:00:00', priority: 'medium', waitingTime: 30 },
  { id: 'AUD-003', name: '网络配置调整', applicant: '王五', applyTime: '2026-06-02 08:45:00', status: 'approved', auditor: '审核员B', auditTime: '2026-06-02 09:00:00', priority: 'low', waitingTime: 15 },
  { id: 'AUD-004', name: '安全策略更新', applicant: '赵六', applyTime: '2026-06-01 18:00:00', status: 'timeout', auditor: null, auditTime: null, priority: 'high', waitingTime: 1020 },
  { id: 'AUD-005', name: '日志清理作业', applicant: '钱七', applyTime: '2026-06-02 07:30:00', status: 'rejected', auditor: '审核员A', auditTime: '2026-06-02 08:00:00', priority: 'low', waitingTime: 30 },
];

export function JobAuditStatusMonitor() {
  const [tasks] = useState(mockTasks);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchSearch = !searchKeyword || task.name.includes(searchKeyword) || task.applicant.includes(searchKeyword);
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    auditing: tasks.filter(t => t.status === 'auditing').length,
    timeout: tasks.filter(t => t.status === 'timeout').length,
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-400 text-sm"><Clock className="w-4 h-4" />待审核</span>;
      case 'auditing':
        return <span className="flex items-center gap-1 text-blue-400 text-sm"><Activity className="w-4 h-4" />审核中</span>;
      case 'approved':
        return <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />已通过</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-400 text-sm"><XCircle className="w-4 h-4" />已驳回</span>;
      case 'timeout':
        return <span className="flex items-center gap-1 text-orange-400 text-sm"><AlertTriangle className="w-4 h-4" />已超时</span>;
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">高</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">中</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">低</span>;
      default:
        return priority;
    }
  };

  const formatWaitingTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  const isUrgent = (task: AuditTask) => {
    return (task.status === 'pending' || task.status === 'auditing') && task.waitingTime > 30;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业审核任务状态监控</h2>
        <p className="text-sm text-gray-400 mt-1">状态监控、待审提醒、超时告警</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-gray-400" />
            <p className="text-gray-400 text-xs">任务总数</p>
          </div>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-xs">待审核</p>
          </div>
          <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-xs">审核中</p>
          </div>
          <p className="text-xl font-semibold text-blue-400">{stats.auditing}</p>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <p className="text-gray-400 text-xs">已超时</p>
          </div>
          <p className="text-xl font-semibold text-orange-400">{stats.timeout}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称或申请人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="pending">待审核</option>
                <option value="auditing">审核中</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
                <option value="timeout">已超时</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#2A354D] hover:bg-[#253042] text-gray-300 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            提醒设置
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">申请人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">申请时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">优先级</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">等待时长</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">审核人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredTasks.map((task) => (
              <tr key={task.id} className={`hover:bg-[#2A354D]/30 ${isUrgent(task) ? 'bg-red-500/5' : ''}`}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {isUrgent(task) && <Bell className="w-4 h-4 text-red-400 animate-pulse" />}
                    <span className="text-sm text-gray-300">{task.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-300">{task.applicant}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-400">{task.applyTime}</span>
                </td>
                <td className="px-4 py-4">
                  {getPriorityBadge(task.priority)}
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm ${isUrgent(task) ? 'text-red-400' : 'text-gray-300'}`}>
                    {formatWaitingTime(task.waitingTime)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-300">{task.auditor || '-'}</span>
                </td>
                <td className="px-4 py-4">
                  {getStatusDisplay(task.status)}
                </td>
                <td className="px-4 py-4">
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    查看
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
