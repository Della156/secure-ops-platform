'use client';

import React, { useState } from 'react';
import { Download, Calendar, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const issueData = [
  { category: '僵尸账号', count: 12, risk: 'medium' },
  { category: '权限滥用', count: 8, risk: 'high' },
  { category: '特权账号', count: 5, risk: 'high' },
  { category: '权限继承', count: 15, risk: 'low' },
  { category: '其他', count: 3, risk: 'medium' },
];

const riskData = [
  { date: '05-28', high: 5, medium: 12, low: 8 },
  { date: '05-29', high: 8, medium: 15, low: 10 },
  { date: '05-30', high: 3, medium: 10, low: 6 },
  { date: '05-31', high: 6, medium: 14, low: 9 },
  { date: '06-01', high: 7, medium: 11, low: 7 },
  { date: '06-02', high: 4, medium: 13, low: 8 },
];

export function AuditReportGen() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalIssues: issueData.reduce((sum, d) => sum + d.count, 0),
    highRisk: issueData.filter(d => d.risk === 'high').reduce((sum, d) => sum + d.count, 0),
    mediumRisk: issueData.filter(d => d.risk === 'medium').reduce((sum, d) => sum + d.count, 0),
    lowRisk: issueData.filter(d => d.risk === 'low').reduce((sum, d) => sum + d.count, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">审计报告生成</h2>
        <p className="text-sm text-gray-400 mt-1">审计结果统计分析、不合规项列表、风险等级评估、审计报告导出</p>
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
              <p className="text-gray-400 text-xs">不合规总数</p>
              <p className="text-xl font-semibold text-white">{stats.totalIssues}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">高风险</p>
              <p className="text-xl font-semibold text-red-400">{stats.highRisk}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">中风险</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.mediumRisk}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">低风险</p>
              <p className="text-xl font-semibold text-green-400">{stats.lowRisk}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">不合规项分类统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={issueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="category" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">风险等级分布趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="high" name="高风险" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="medium" name="中风险" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="low" name="低风险" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}