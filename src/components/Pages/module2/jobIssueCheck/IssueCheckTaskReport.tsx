'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, CheckCircle, XCircle, AlertTriangle, PieChart, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const taskStatsData = [
  { name: '06-01', total: 15, success: 12, failed: 1 },
  { name: '06-02', total: 18, success: 15, failed: 1 },
  { name: '06-03', total: 12, success: 10, failed: 0 },
  { name: '06-04', total: 20, success: 18, failed: 0 },
  { name: '06-05', total: 14, success: 12, failed: 1 },
  { name: '06-06', total: 16, success: 14, failed: 0 },
];

const issueTypeData = [
  { name: '配置错误', value: 15, color: '#3B82F6' },
  { name: '安全漏洞', value: 8, color: '#EF4444' },
  { name: '性能问题', value: 12, color: '#F97316' },
  { name: '规则冗余', value: 5, color: '#8B5CF6' },
  { name: '其他', value: 3, color: '#6B7280' },
];

const severityData = [
  { name: '严重', value: 5, color: '#EF4444' },
  { name: '高', value: 12, color: '#F97316' },
  { name: '中', value: 18, color: '#EAB308' },
  { name: '低', value: 8, color: '#3B82F6' },
];

export function IssueCheckTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-06' });

  const stats = {
    totalTasks: 95,
    successRate: 92.6,
    totalIssues: 43,
    avgTaskTime: '18分钟',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业问题检查任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">任务统计分析、问题类型分布、严重程度分布、报告导出</p>
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
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#2A354D]/80 text-gray-300 rounded-lg transition-colors text-sm">
              <FileText className="w-4 h-4" />
              查看详情
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
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-sm">任务总数</p>
          </div>
          <p className="text-2xl font-semibold text-white">{stats.totalTasks}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">成功率</p>
          </div>
          <p className="text-2xl font-semibold text-green-400">{stats.successRate}%</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-sm">发现问题</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">{stats.totalIssues}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <p className="text-gray-400 text-sm">平均耗时</p>
          </div>
          <p className="text-2xl font-semibold text-white">{stats.avgTaskTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            任务执行统计
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskStatsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="total" name="总任务数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="失败" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            问题类型分布
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={issueTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {issueTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          问题严重程度分布
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <RePieChart>
            <Pie
              data={severityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {severityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">关键发现摘要</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-red-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm font-medium text-red-400">严重问题</span>
            </div>
            <p className="text-gray-400 text-sm">发现5个严重安全漏洞需要立即修复</p>
          </div>
          <div className="bg-[#111827] border border-orange-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">高风险问题</span>
            </div>
            <p className="text-gray-400 text-sm">12个高风险问题建议在本周内处理</p>
          </div>
          <div className="bg-[#111827] border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">优化建议</span>
            </div>
            <p className="text-gray-400 text-sm">发现多个配置优化项，可提升系统性能</p>
          </div>
        </div>
      </div>
    </div>
  );
}
