'use client';

import React, { useState } from 'react';
import { Download, Calendar, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const executionData = [
  { date: '05-28', executed: 15, success: 14, failed: 1 },
  { date: '05-29', executed: 18, success: 18, failed: 0 },
  { date: '05-30', executed: 12, success: 11, failed: 1 },
  { date: '05-31', executed: 20, success: 19, failed: 1 },
  { date: '06-01', executed: 16, success: 15, failed: 1 },
  { date: '06-02', executed: 14, success: 13, failed: 1 },
];

const durationData = [
  { date: '05-28', avg: 45, max: 120 },
  { date: '05-29', avg: 38, max: 95 },
  { date: '05-30', avg: 52, max: 110 },
  { date: '05-31', avg: 40, max: 85 },
  { date: '06-01', avg: 48, max: 105 },
  { date: '06-02', avg: 42, max: 90 },
];

export function ScheduledTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalTasks: executionData.reduce((sum, d) => sum + d.executed, 0),
    successRate: Math.round((executionData.reduce((sum, d) => sum + d.success, 0) / executionData.reduce((sum, d) => sum + d.executed, 0)) * 100),
    avgDuration: Math.round(durationData.reduce((sum, d) => sum + d.avg, 0) / durationData.length),
    totalFailed: executionData.reduce((sum, d) => sum + d.failed, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">定时任务执行报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内定时任务执行统计（执行次数、成功率、耗时）、报告导出</p>
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
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">执行次数</p>
              <p className="text-xl font-semibold text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功率</p>
              <p className="text-xl font-semibold text-green-400">{stats.successRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">平均耗时</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.avgDuration}秒</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败次数</p>
              <p className="text-xl font-semibold text-red-400">{stats.totalFailed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">任务执行统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={executionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="executed" name="执行次数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功次数" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="失败次数" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">执行耗时趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Line type="monotone" dataKey="avg" name="平均耗时(秒)" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="max" name="最大耗时(秒)" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}