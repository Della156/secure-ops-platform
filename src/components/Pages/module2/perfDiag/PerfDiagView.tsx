'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, Filter, AlertTriangle, CheckCircle, Clock, Activity, Eye, FileText, RefreshCw } from 'lucide-react';

interface DiagTask {
  id: string;
  name: string;
  target: string;
  status: 'success' | 'failed' | 'running' | 'pending' | 'abnormal';
  result: string;
  checkTime: string;
  duration: string;
  assignee: string;
}

const mockTasks: DiagTask[] = [
  { id: 'PERF-001', name: 'CPU性能诊断', target: '服务器SRV-01', status: 'running', result: '诊断中...', checkTime: '2026-06-02 10:30:00', duration: '00:05:32', assignee: '张三' },
  { id: 'PERF-002', name: '内存泄漏检测', target: '应用服务器APP-02', status: 'success', result: '已完成，发现2处泄漏', checkTime: '2026-06-02 09:15:00', duration: '00:12:18', assignee: '李四' },
  { id: 'PERF-003', name: '数据库慢查询分析', target: '数据库DB-01', status: 'failed', result: '连接超时', checkTime: '2026-06-02 08:00:00', duration: '00:08:45', assignee: '王五' },
  { id: 'PERF-004', name: '网络带宽测试', target: '交换机SW-01', status: 'pending', result: '待诊断', checkTime: '-', duration: '-', assignee: '赵六' },
  { id: 'PERF-005', name: '磁盘IO监控', target: '存储服务器STOR-01', status: 'abnormal', result: 'IO使用率过高', checkTime: '2026-06-02 07:30:00', duration: '00:15:22', assignee: '钱七' },
];

export function PerfDiagView() {
  const [tasks] = useState(mockTasks);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchKeyword || task.name.includes(searchKeyword) || task.target.includes(searchKeyword);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    success: tasks.filter(t => t.status === 'success').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    running: tasks.filter(t => t.status === 'running').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    abnormal: tasks.filter(t => t.status === 'abnormal').length,
  };

  const statusColors: Record<string, string> = {
    success: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
    running: 'bg-blue-500/20 text-blue-400',
    pending: 'bg-gray-500/20 text-gray-400',
    abnormal: 'bg-yellow-500/20 text-yellow-400',
  };

  const statusLabels: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '运行中',
    pending: '待诊断',
    abnormal: '异常',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">性能诊断视图</h2>
        <p className="text-sm text-gray-400 mt-1">诊断任务列表展示、过程展示、结果展示、条件查询、数据导出、数据统计</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-xs">总任务</p>
          <p className="text-xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">成功</p>
          <p className="text-xl font-semibold text-green-400">{stats.success}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">失败</p>
          <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">运行中</p>
          <p className="text-xl font-semibold text-blue-400">{stats.running}</p>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">待诊断</p>
          <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-xs">异常</p>
          <p className="text-xl font-semibold text-yellow-400">{stats.abnormal}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称或目标..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="success">成功</option>
                <option value="failed">失败</option>
                <option value="running">运行中</option>
                <option value="pending">待诊断</option>
                <option value="abnormal">异常</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111827]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">序号</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断目标</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断结果</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">诊断时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">耗时</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">负责人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredTasks.map((task, idx) => (
              <tr key={task.id} className="hover:bg-[#2A354D]/30">
                <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                <td className="px-4 py-3">
                  <span className="text-sm text-blue-400 hover:underline">{task.name}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{task.target}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status as keyof typeof statusColors]}`}>
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{task.result}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.checkTime}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.duration}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{task.assignee}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-[#2A354D] rounded transition-colors" title="查看详情">
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>
                    <button className="p-1.5 hover:bg-[#2A354D] rounded transition-colors" title="查看过程">
                      <FileText className="w-4 h-4 text-green-400" />
                    </button>
                    {(task.status === 'failed' || task.status === 'abnormal') && (
                      <button className="p-1.5 hover:bg-[#2A354D] rounded transition-colors" title="重试">
                        <RefreshCw className="w-4 h-4 text-yellow-400" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
