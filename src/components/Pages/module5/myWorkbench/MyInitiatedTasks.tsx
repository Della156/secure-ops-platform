'use client';

import React, { useState } from 'react';
import {
  FileText, Search, Filter, Calendar, Clock,
  ChevronRight, MoreVertical, User,
  Play, Pause, CheckCircle2, AlertCircle
} from 'lucide-react';

interface InitiatedTask {
  id: string;
  title: string;
  type: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  createdAt: string;
  assignees: string[];
  progress: number;
  priority: 'high' | 'medium' | 'low';
}

const initiatedTasks: InitiatedTask[] = [
  { id: 'IT-001', title: '漏洞扫描任务', type: '安全扫描', status: 'running', createdAt: '2026-06-02 09:00', assignees: ['张工', '李工'], progress: 75, priority: 'high' },
  { id: 'IT-002', title: '安全策略更新', type: '策略管理', status: 'completed', createdAt: '2026-06-01 14:30', assignees: ['王工'], progress: 100, priority: 'medium' },
  { id: 'IT-003', title: '日志审计', type: '审计任务', status: 'pending', createdAt: '2026-06-02 10:00', assignees: ['赵工', '张工'], progress: 0, priority: 'low' },
  { id: 'IT-004', title: '资产盘点', type: '资产管理', status: 'failed', createdAt: '2026-05-31 16:00', assignees: ['李工'], progress: 45, priority: 'medium' },
];

function StatusBadge({ status }: { status: InitiatedTask['status'] }) {
  const config = {
    running: { bg: 'bg-green-500/10', text: 'text-green-400', label: '运行中', icon: <Play className="w-3 h-3" /> },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '已完成', icon: <CheckCircle2 className="w-3 h-3" /> },
    failed: { bg: 'bg-red-500/10', text: 'text-red-400', label: '失败', icon: <AlertCircle className="w-3 h-3" /> },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '待执行', icon: <Pause className="w-3 h-3" /> },
  };
  const { bg, text, label, icon } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${bg} ${text}`}>
      {icon}
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: InitiatedTask['priority'] }) {
  const config = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', label: '高' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '低' },
  };
  const { bg, text, label } = config[priority];
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function MyInitiatedTasks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = initiatedTasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: initiatedTasks.length,
    running: initiatedTasks.filter(t => t.status === 'running').length,
    completed: initiatedTasks.filter(t => t.status === 'completed').length,
    failed: initiatedTasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            我发起的任务
          </h2>
          <p className="text-sm text-gray-400 mt-1">查看和管理您发起的任务</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            发起新任务
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '发起任务', value: stats.total, icon: <FileText className="w-4 h-4" />, color: 'blue' },
          { label: '运行中', value: stats.running, icon: <Play className="w-4 h-4" />, color: 'green' },
          { label: '已完成', value: stats.completed, icon: <CheckCircle2 className="w-4 h-4" />, color: 'purple' },
          { label: '失败', value: stats.failed, icon: <AlertCircle className="w-4 h-4" />, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索任务名称或类型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">全部状态</option>
                <option value="running">运行中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
                <option value="pending">待执行</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-[#111625] cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.status === 'running' ? 'bg-green-500/20' :
                    task.status === 'completed' ? 'bg-blue-500/20' :
                    task.status === 'failed' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      task.status === 'running' ? 'text-green-400' :
                      task.status === 'completed' ? 'text-blue-400' :
                      task.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{task.title}</h3>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">{task.type}</span>
                      <StatusBadge status={task.status} />
                    </div>
                    {task.status !== 'pending' && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">进度</span>
                          <span className="text-white">{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="p-1 hover:bg-[#20293F] rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">创建时间</div>
                    <div className="text-sm text-white">{task.createdAt}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A354D]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">执行人:</span>
                  <div className="flex -space-x-2">
                    {task.assignees.map((assignee, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center border-2 border-[#20293F]"
                      >
                        <User className="w-3 h-3 text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-1">{task.assignees.join(', ')}</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                  查看详情 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredTasks.length} 个任务</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInitiatedTasks;