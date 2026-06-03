'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Bell } from 'lucide-react';

interface AuditTask {
  id: string;
  planName: string;
  creator: string;
  auditor: string;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  submitTime: string;
  lastUpdate: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
}

const mockTasks: AuditTask[] = [
  { id: 'JPA-001', planName: '系统补丁升级方案', creator: '张工', auditor: '李经理', status: 'in_progress', submitTime: '2026-06-02 09:00:00', lastUpdate: '刚刚', deadline: '2026-06-03 18:00:00', priority: 'high', message: '审核员正在审核中...' },
  { id: 'JPA-002', planName: '网络架构优化方案', creator: '王工', auditor: '赵经理', status: 'approved', submitTime: '2026-06-01 14:00:00', lastUpdate: '1小时前', deadline: '2026-06-02 18:00:00', priority: 'medium', message: '审核通过' },
  { id: 'JPA-003', planName: '数据库迁移方案', creator: '李工', auditor: '钱经理', status: 'pending', submitTime: '2026-06-02 07:00:00', lastUpdate: '-', deadline: '2026-06-03 18:00:00', priority: 'high', message: '等待分配审核员' },
  { id: 'JPA-004', planName: '安全加固方案', creator: '赵工', auditor: '孙经理', status: 'rejected', submitTime: '2026-06-01 10:00:00', lastUpdate: '3小时前', deadline: '2026-06-02 18:00:00', priority: 'medium', message: '方案需修改后重新提交' },
  { id: 'JPA-005', planName: '灾备演练方案', creator: '钱工', auditor: '周经理', status: 'pending', submitTime: '2026-06-02 08:30:00', lastUpdate: '-', deadline: '2026-06-04 18:00:00', priority: 'low', message: '等待审核员处理' },
];

export function PlanAuditStatusMonitor() {
  const [tasks, setTasks] = useState<AuditTask[]>(mockTasks);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    approved: tasks.filter(t => t.status === 'approved').length,
    rejected: tasks.filter(t => t.status === 'rejected').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'rejected') return <XCircle className="w-5 h-5 text-red-400" />;
    if (status === 'in_progress') return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
    return <Clock className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已通过</span>;
    if (status === 'rejected') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">已驳回</span>;
    if (status === 'in_progress') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">审核中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待审核</span>;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center gap-1"><Bell className="w-3 h-3" />高优先级</span>;
    if (priority === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中优先级</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">低优先级</span>;
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < currentTime;
  };

  const isUrgent = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const hoursUntilDeadline = (deadlineDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeadline > 0 && hoursUntilDeadline < 24;
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">作业方案审核任务状态监控</h2>
            <p className="text-sm text-gray-400 mt-1">审核任务状态监控、待审提醒、超时告警</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">实时更新</span>
            <span className="text-sm">{currentTime.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待审核</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">审核中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">已驳回</p>
              <p className="text-xl font-semibold text-red-400">{stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">高优先级</p>
              <p className="text-xl font-semibold text-orange-400">{stats.highPriority}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 ${
              isOverdue(task.deadline) ? 'border-red-500/50 bg-red-500/5' :
              isUrgent(task.deadline) ? 'border-orange-500/50 bg-orange-500/5' :
              ''
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white font-medium">{task.planName}</span>
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                    {isOverdue(task.deadline) && <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/30 text-red-400 animate-pulse">已超时</span>}
                    {isUrgent(task.deadline) && !isOverdue(task.deadline) && <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/30 text-orange-400 animate-pulse">即将到期</span>}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{task.message}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>创建人：{task.creator}</span>
                    <span>审核人：{task.auditor}</span>
                    <span>提交时间：{task.submitTime}</span>
                    <span>最后更新：{task.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">截止时间</p>
                <p className={`text-sm ${isOverdue(task.deadline) ? 'text-red-400' : isUrgent(task.deadline) ? 'text-orange-400' : 'text-gray-400'}`}>
                  {task.deadline}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}