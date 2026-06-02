'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart2, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const taskData = [
  { date: '05-28', total: 12, success: 10, failed: 2 },
  { date: '05-29', total: 15, success: 13, failed: 2 },
  { date: '05-30', total: 10, success: 9, failed: 1 },
  { date: '05-31', total: 18, success: 15, failed: 3 },
  { date: '06-01', total: 20, success: 18, failed: 2 },
  { date: '06-02', total: 14, success: 12, failed: 2 },
];

const issueTypeData = [
  { name: 'CPU性能', value: 40 },
  { name: '内存问题', value: 30 },
  { name: '数据库', value: 15 },
  { name: '网络', value: 10 },
  { name: '存储', value: 5 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const performanceTrendData = [
  { time: '00:00', cpu: 45, memory: 55 },
  { time: '04:00', cpu: 30, memory: 48 },
  { time: '08:00', cpu: 65, memory: 62 },
  { time: '12:00', cpu: 80, memory: 70 },
  { time: '16:00', cpu: 75, memory: 68 },
  { time: '20:00', cpu: 55, memory: 60 },
  { time: '24:00', cpu: 40, memory: 52 },
];

export function PerfDiagTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    total: taskData.reduce((sum, d) => sum + d.total, 0),
    success: taskData.reduce((sum, d) => sum + d.success, 0),
    failed: taskData.reduce((sum, d) => sum + d.failed, 0),
    successRate: Math.round((taskData.reduce((sum, d) => sum + d.success, 0) / taskData.reduce((sum, d) => sum + d.total, 0)) * 100),
  };

  const highPriorityIssues = [
    { id: 1, title: 'SRV-01 CPU持续过高', severity: 'high', status: '待处理', time: '2026-06-02 10:30' },
    { id: 2, title: 'APP-02 内存泄漏风险', severity: 'medium', status: '处理中', time: '2026-06-02 09:15' },
    { id: 3, title: 'DB-01 慢查询增多', severity: 'high', status: '待处理', time: '2026-06-02 08:45' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">性能诊断任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">任务统计分析、问题类型分布、报告导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-gray-300 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              预览
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出报告
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-xs">诊断任务总数</p>
          </div>
          <p className="text-2xl font-semibold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-xs">成功诊断</p>
          </div>
          <p className="text-2xl font-semibold text-green-400">{stats.success}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-xs">诊断失败</p>
          </div>
          <p className="text-2xl font-semibold text-red-400">{stats.failed}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-xs">成功率</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">{stats.successRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">诊断任务趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="total" name="总任务" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="失败" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">问题类型分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={issueTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {issueTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">性能指标趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="cpu" name="CPU使用率" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="memory" name="内存使用率" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-medium text-gray-300">高优先级问题</h3>
          </div>
          <div className="space-y-3">
            {highPriorityIssues.map((issue) => (
              <div key={issue.id} className={`border rounded-lg p-3 ${
                issue.severity === 'high' ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    issue.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {issue.severity === 'high' ? '高' : '中'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    issue.status === '待处理' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-1">{issue.title}</p>
                <p className="text-xs text-gray-500">{issue.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
