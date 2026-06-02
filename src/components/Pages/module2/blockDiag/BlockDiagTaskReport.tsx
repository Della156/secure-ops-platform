'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart2, FileText, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const taskData = [
  { date: '05-28', total: 15, success: 12, failed: 3 },
  { date: '05-29', total: 18, success: 16, failed: 2 },
  { date: '05-30', total: 12, success: 10, failed: 2 },
  { date: '05-31', total: 20, success: 17, failed: 3 },
  { date: '06-01', total: 16, success: 15, failed: 1 },
  { date: '06-02', total: 14, success: 13, failed: 1 },
];

const blockTypeData = [
  { name: 'SQL注入', value: 45 },
  { name: 'XSS攻击', value: 30 },
  { name: '策略误判', value: 15 },
  { name: '其他', value: 10 },
];

const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#6B7280'];

export function BlockDiagTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    total: taskData.reduce((sum, d) => sum + d.total, 0),
    success: taskData.reduce((sum, d) => sum + d.success, 0),
    failed: taskData.reduce((sum, d) => sum + d.failed, 0),
    falsePositive: 8,
  };

  const successRate = Math.round((stats.success / stats.total) * 100);
  const falsePositiveRate = Math.round((stats.falsePositive / stats.total) * 100);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全阻断诊断任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">任务统计分析、阻断类型分布、误报率统计、报告导出</p>
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
            <BarChart2 className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">诊断任务总数</p>
              <p className="text-xl font-semibold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功诊断</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">成功率</p>
              <p className="text-xl font-semibold text-yellow-400">{successRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">误报率</p>
              <p className="text-xl font-semibold text-orange-400">{falsePositiveRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">诊断任务统计</h3>
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
          <h3 className="text-sm font-medium text-gray-300 mb-4">阻断类型分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={blockTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {blockTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
