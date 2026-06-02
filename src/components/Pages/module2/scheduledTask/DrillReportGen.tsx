'use client';

import React, { useState } from 'react';
import { Download, Calendar, CheckCircle, Clock, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const drillData = [
  { date: '05-28', completed: 3, failed: 1, avgTime: 45 },
  { date: '05-29', completed: 5, failed: 0, avgTime: 38 },
  { date: '05-30', completed: 2, failed: 1, avgTime: 52 },
  { date: '05-31', completed: 4, failed: 0, avgTime: 40 },
  { date: '06-01', completed: 3, failed: 1, avgTime: 48 },
  { date: '06-02', completed: 2, failed: 0, avgTime: 42 },
];

export function DrillReportGen() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalDrills: drillData.reduce((sum, d) => sum + d.completed + d.failed, 0),
    completed: drillData.reduce((sum, d) => sum + d.completed, 0),
    successRate: Math.round((drillData.reduce((sum, d) => sum + d.completed, 0) / drillData.reduce((sum, d) => sum + d.completed + d.failed, 0)) * 100),
    avgDuration: Math.round(drillData.reduce((sum, d) => sum + d.avgTime, 0) / drillData.length),
  };

  const conclusion = `本次演练周期内共执行 ${stats.totalDrills} 次演练任务，其中 ${stats.completed} 次成功完成，成功率达到 ${stats.successRate}%。平均演练耗时 ${stats.avgDuration} 分钟。整体演练效果良好，建议继续保持定期演练频率，针对失败案例进行复盘分析。`;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">演练报告生成</h2>
        <p className="text-sm text-gray-400 mt-1">演练结果统计、演练耗时分析、演练结论自动生成、演练报告导出</p>
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
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">演练总数</p>
              <p className="text-xl font-semibold text-white">{stats.totalDrills}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">完成次数</p>
              <p className="text-xl font-semibold text-green-400">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">成功率</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.successRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">平均耗时</p>
              <p className="text-xl font-semibold text-white">{stats.avgDuration}分钟</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">演练完成统计</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={drillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="completed" name="完成" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="失败" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">演练耗时趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={drillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Line type="monotone" dataKey="avgTime" name="平均耗时(分)" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">演练结论</h3>
        <div className="bg-[#111827] rounded-lg p-4">
          <p className="text-gray-300 leading-relaxed">{conclusion}</p>
        </div>
      </div>
    </div>
  );
}