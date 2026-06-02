'use client';

import React, { useState } from 'react';
import { Download, Calendar, CheckCircle, XCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const taskData = [
  { date: '05-28', tasks: 15, success: 12, failure: 3, fixRate: 80 },
  { date: '05-29', tasks: 20, success: 18, failure: 2, fixRate: 90 },
  { date: '05-30', tasks: 10, success: 9, failure: 1, fixRate: 90 },
  { date: '05-31', tasks: 18, success: 16, failure: 2, fixRate: 89 },
  { date: '06-01', tasks: 22, success: 20, failure: 2, fixRate: 91 },
  { date: '06-02', tasks: 15, success: 15, failure: 0, fixRate: 100 },
];

export function VulnTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalTasks: taskData.reduce((sum, d) => sum + d.tasks, 0),
    success: taskData.reduce((sum, d) => sum + d.success, 0),
    failure: taskData.reduce((sum, d) => sum + d.failure, 0),
    avgFixRate: Math.round(taskData.reduce((sum, d) => sum + d.fixRate, 0) / taskData.length),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全漏洞加固任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内漏洞加固统计分析、漏洞修复率统计、报告导出</p>
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
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">任务总数</p>
              <p className="text-xl font-semibold text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功修复</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">修复失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failure}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">平均修复率</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.avgFixRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">漏洞修复统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="tasks" name="任务数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failure" name="失败" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">漏洞修复率趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Line type="monotone" dataKey="fixRate" name="修复率(%)" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}