'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface MonitorTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  alertCount: number;
  alertTypes: { type: string; count: number }[];
  startTime: string;
}

const mockTasks: MonitorTask[] = [
  { id: 'MON-001', name: '核心系统告警监测', status: 'running', alertCount: 156, alertTypes: [{ type: '攻击', count: 45 }, { type: '异常', count: 67 }, { type: '警告', count: 44 }], startTime: '2026-06-03 08:00:00' },
  { id: 'MON-002', name: '边界安全监测', status: 'running', alertCount: 89, alertTypes: [{ type: '攻击', count: 32 }, { type: '异常', count: 28 }, { type: '警告', count: 29 }], startTime: '2026-06-03 08:00:00' },
  { id: 'MON-003', name: '数据库安全监测', status: 'completed', alertCount: 23, alertTypes: [{ type: '异常', count: 12 }, { type: '警告', count: 11 }], startTime: '2026-06-03 07:30:00' },
  { id: 'MON-004', name: '应用服务监测', status: 'failed', alertCount: 45, alertTypes: [{ type: '攻击', count: 28 }, { type: '异常', count: 17 }], startTime: '2026-06-03 06:00:00' },
];

const alertTypeData = [
  { name: '攻击', value: 105, fill: '#EF4444' },
  { name: '异常', value: 115, fill: '#F59E0B' },
  { name: '警告', value: 84, fill: '#3B82F6' },
];

const dailyAlertData = [
  { day: '周一', count: 120 },
  { day: '周二', count: 145 },
  { day: '周三', count: 98 },
  { day: '周四', count: 167 },
  { day: '周五', count: 134 },
  { day: '周六', count: 76 },
  { day: '周日', count: 89 },
];

export function AlertMonitorView() {
  const [tasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<MonitorTask | null>(null);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-green-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '运行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return status;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">告警辅助监测视图</h2>
            <p className="text-sm text-gray-400 mt-1">监测任务列表展示、告警分析、影响评估、趋势预测</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm">
              <option value="today">今日</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 text-sm">总监测任务数</span>
          </div>
          <p className="text-2xl font-semibold text-white">4</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 text-sm">今日新告警数</span>
          </div>
          <p className="text-2xl font-semibold text-red-400">314</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">待处置告警数</span>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">89</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">已完成任务数</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            近7日告警趋势
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAlertData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            告警类型分布
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={alertTypeData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {alertTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索任务名称..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出列表
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A354D]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">告警总数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">告警类型分布</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                <td className="px-4 py-3 text-sm text-gray-300">{task.id}</td>
                <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className={`text-sm ${task.status === 'running' ? 'text-green-400' : task.status === 'completed' ? 'text-blue-400' : 'text-red-400'}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-white">{task.alertCount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {task.alertTypes.map((type, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">
                        {type.type}({type.count})
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{task.startTime}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 bg-[#2A354D] hover:bg-[#3D4A61] rounded text-gray-400 transition-colors" title="查看详情">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded text-blue-400 transition-colors" title="查看过程">
                      <Activity className="w-4 h-4" />
                    </button>
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