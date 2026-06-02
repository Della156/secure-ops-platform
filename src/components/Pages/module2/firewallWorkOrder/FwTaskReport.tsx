'use client';

import React, { useState } from 'react';
import { Download, Calendar, FileText, TrendingUp, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const taskData = [
  { date: '05-28', tasks: 15, adds: 5, modifies: 6, deletes: 4 },
  { date: '05-29', tasks: 18, adds: 7, modifies: 8, deletes: 3 },
  { date: '05-30', tasks: 12, adds: 4, modifies: 5, deletes: 3 },
  { date: '05-31', tasks: 20, adds: 8, modifies: 7, deletes: 5 },
  { date: '06-01', tasks: 22, adds: 9, modifies: 8, deletes: 5 },
  { date: '06-02', tasks: 16, adds: 6, modifies: 7, deletes: 3 },
];

export function FwTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalTasks: taskData.reduce((sum, d) => sum + d.tasks, 0),
    totalAdds: taskData.reduce((sum, d) => sum + d.adds, 0),
    totalModifies: taskData.reduce((sum, d) => sum + d.modifies, 0),
    totalDeletes: taskData.reduce((sum, d) => sum + d.deletes, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">防火墙策略工单任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内工单任务统计分析、策略变更统计报告导出</p>
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
              <p className="text-gray-400 text-xs">总工单</p>
              <p className="text-xl font-semibold text-white">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">新增策略</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalAdds}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">修改策略</p>
              <p className="text-xl font-semibold text-blue-400">{stats.totalModifies}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">删除策略</p>
              <p className="text-xl font-semibold text-red-400">{stats.totalDeletes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">工单处理量统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="tasks" name="总工单" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="adds" name="新增" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="modifies" name="修改" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deletes" name="删除" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">工单趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Line type="monotone" dataKey="tasks" name="总工单" stroke="#6B7280" strokeWidth={2} />
              <Line type="monotone" dataKey="adds" name="新增" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="modifies" name="修改" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="deletes" name="删除" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}