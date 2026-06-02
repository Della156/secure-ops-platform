'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const backupData = [
  { date: '05-28', count: 12, success: 10 },
  { date: '05-29', count: 15, success: 14 },
  { date: '05-30', count: 10, success: 9 },
  { date: '05-31', count: 18, success: 17 },
  { date: '06-01', count: 14, success: 13 },
  { date: '06-02', count: 16, success: 14 },
];

const durationData = [
  { date: '05-28', avgDuration: 25, maxDuration: 45 },
  { date: '05-29', avgDuration: 22, maxDuration: 38 },
  { date: '05-30', avgDuration: 28, maxDuration: 52 },
  { date: '05-31', avgDuration: 20, maxDuration: 35 },
  { date: '06-01', avgDuration: 24, maxDuration: 42 },
  { date: '06-02', avgDuration: 26, maxDuration: 48 },
];

export function BackupTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalTasks: backupData.reduce((sum, d) => sum + d.count, 0),
    totalSuccess: backupData.reduce((sum, d) => sum + d.success, 0),
    avgSuccessRate: Math.round(backupData.reduce((sum, d) => sum + (d.success / d.count * 100), 0) / backupData.length),
    avgDuration: Math.round(durationData.reduce((sum, d) => sum + d.avgDuration, 0) / durationData.length),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">备份任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内备份任务统计分析（成功率、耗时）、备份报告导出</p>
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
            <BarChart3 className="w-5 h-5 text-blue-400" />
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
              <p className="text-gray-400 text-xs">成功次数</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalSuccess}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">成功率</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.avgSuccessRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均耗时</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.avgDuration}分钟</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">备份任务统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={backupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="count" name="总数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">备份耗时趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Line type="monotone" dataKey="avgDuration" name="平均耗时(分)" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="maxDuration" name="最大耗时(分)" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}