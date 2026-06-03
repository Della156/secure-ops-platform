'use client';

import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { date: '周一', total: 12, approved: 10, rejected: 2 },
  { date: '周二', total: 18, approved: 15, rejected: 3 },
  { date: '周三', total: 15, approved: 13, rejected: 2 },
  { date: '周四', total: 20, approved: 17, rejected: 3 },
  { date: '周五', total: 14, approved: 12, rejected: 2 },
  { date: '周六', total: 5, approved: 4, rejected: 1 },
  { date: '周日', total: 3, approved: 3, rejected: 0 },
];

const rejectReasons = [
  { name: '资质不足', value: 8, color: '#EF4444' },
  { name: '缺少预案', value: 5, color: '#F59E0B' },
  { name: '时间冲突', value: 4, color: '#3B82F6' },
  { name: '风险过高', value: 3, color: '#8B5CF6' },
];

const auditorStats = [
  { name: '审核员A', total: 45, approved: 38, rejected: 7 },
  { name: '审核员B', total: 38, approved: 33, rejected: 5 },
  { name: '审核员C', total: 32, approved: 28, rejected: 4 },
];

export function JobAuditTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-05-27', end: '2026-06-02' });

  const totalStats = {
    totalTasks: weeklyData.reduce((sum, d) => sum + d.total, 0),
    approved: weeklyData.reduce((sum, d) => sum + d.approved, 0),
    rejected: weeklyData.reduce((sum, d) => sum + d.rejected, 0),
    approvalRate: Math.round((weeklyData.reduce((sum, d) => sum + d.approved, 0) / weeklyData.reduce((sum, d) => sum + d.total, 0)) * 100),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业审核任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">任务统计分析、通过率统计、驳回原因分布、报告导出</p>
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
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] border border-[#2A354D] hover:bg-[#253042] text-gray-300 rounded-lg transition-colors">
              <FileText className="w-4 h-4" />
              预览报告
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
            <FileText className="w-5 h-5 text-gray-400" />
            <p className="text-gray-400 text-xs">任务总数</p>
          </div>
          <p className="text-2xl font-semibold text-white">{totalStats.totalTasks}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-xs">通过数</p>
          </div>
          <p className="text-2xl font-semibold text-green-400">{totalStats.approved}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-xs">驳回数</p>
          </div>
          <p className="text-2xl font-semibold text-red-400">{totalStats.rejected}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-xs">通过率</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">{totalStats.approvalRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">每日审核趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="approved" name="通过" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" name="驳回" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">驳回原因分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={rejectReasons}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {rejectReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">审核员统计</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={auditorStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis dataKey="name" type="category" stroke="#6B7280" width={80} />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
            <Legend />
            <Bar dataKey="approved" name="通过" fill="#10B981" radius={[0, 4, 4, 0]} />
            <Bar dataKey="rejected" name="驳回" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
