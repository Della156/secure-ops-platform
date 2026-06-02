'use client';

import React, { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const changeData = [
  { date: '05-28', changes: 45, success: 42 },
  { date: '05-29', changes: 52, success: 50 },
  { date: '05-30', changes: 38, success: 35 },
  { date: '05-31', changes: 55, success: 53 },
  { date: '06-01', changes: 48, success: 46 },
  { date: '06-02', changes: 60, success: 58 },
];

const successRateData = [
  { date: '05-28', rate: 93.3 },
  { date: '05-29', rate: 96.2 },
  { date: '05-30', rate: 92.1 },
  { date: '05-31', rate: 96.4 },
  { date: '06-01', rate: 95.8 },
  { date: '06-02', rate: 96.7 },
];

interface ChangeCategory {
  category: string;
  count: number;
  successRate: number;
}

const categoryData: ChangeCategory[] = [
  { category: '配置更新', count: 120, successRate: 98.3 },
  { category: '数据同步', count: 85, successRate: 96.5 },
  { category: '权限变更', count: 45, successRate: 97.8 },
  { category: '参数调整', count: 60, successRate: 95.0 },
  { category: '数据迁移', count: 30, successRate: 93.3 },
];

export function DataProcessingReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalChanges: changeData.reduce((sum, d) => sum + d.changes, 0),
    totalSuccess: changeData.reduce((sum, d) => sum + d.success, 0),
    avgSuccessRate: Math.round(changeData.reduce((sum, d) => sum + (d.success / d.changes * 100), 0) / changeData.length),
    maxChanges: Math.max(...changeData.map(d => d.changes)),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统数据处理报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内数据处理统计分析（变更次数、成功率）、报告导出</p>
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
              <p className="text-gray-400 text-xs">变更总次数</p>
              <p className="text-xl font-semibold text-white">{stats.totalChanges}</p>
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
              <p className="text-gray-400 text-xs">平均成功率</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.avgSuccessRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">单日最大变更</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.maxChanges}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">变更次数统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={changeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="changes" name="变更次数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功次数" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">成功率趋势</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[80, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Line type="monotone" dataKey="rate" name="成功率%" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="p-4 border-b border-[#2A354D]">
          <h3 className="text-sm font-medium text-gray-300">变更类型统计</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更次数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">成功率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item) => (
                <tr key={item.category} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.successRate >= 95 ? 'bg-green-500' : item.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.successRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.successRate >= 95 ? 'text-green-400' : item.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>{item.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {item.successRate >= 95 ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle className="w-4 h-4" />优秀</span>
                    ) : item.successRate >= 90 ? (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm"><CheckCircle className="w-4 h-4" />良好</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm"><XCircle className="w-4 h-4" />需关注</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}