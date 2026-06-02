'use client';

import React, { useState } from 'react';
import { Download, Calendar, Phone, Clock, Star, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const taskData = [
  { date: '05-28', tasks: 25, avgResponseTime: 12, satisfaction: 4.5 },
  { date: '05-29', tasks: 30, avgResponseTime: 10, satisfaction: 4.6 },
  { date: '05-30', tasks: 22, avgResponseTime: 15, satisfaction: 4.4 },
  { date: '05-31', tasks: 28, avgResponseTime: 11, satisfaction: 4.7 },
  { date: '06-01', tasks: 32, avgResponseTime: 9, satisfaction: 4.8 },
  { date: '06-02', tasks: 20, avgResponseTime: 13, satisfaction: 4.6 },
];

export function HelpdeskTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalTasks: taskData.reduce((sum, d) => sum + d.tasks, 0),
    avgResponseTime: Math.round(taskData.reduce((sum, d) => sum + d.avgResponseTime, 0) / taskData.length),
    avgSatisfaction: (taskData.reduce((sum, d) => sum + d.satisfaction, 0) / taskData.length).toFixed(1),
    resolvedRate: 98,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全客服任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内客服任务统计分析（处理量、响应时间、满意度）、报告导出</p>
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
            <Phone className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">处理量</p>
              <p className="text-xl font-semibold text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">平均响应时间(分钟)</p>
              <p className="text-xl font-semibold text-green-400">{stats.avgResponseTime}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">平均满意度</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.avgSatisfaction}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">解决率</p>
              <p className="text-xl font-semibold text-blue-400">{stats.resolvedRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">处理量统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="tasks" name="处理量" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">响应时间与满意度趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Line type="monotone" dataKey="avgResponseTime" name="响应时间(分钟)" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="satisfaction" name="满意度" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}