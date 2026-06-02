'use client';

import React, { useState } from 'react';
import { Download, Calendar, FileText, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: '网络', total: 100, success: 95 },
  { name: '服务', total: 100, success: 90 },
  { name: '数据库', total: 100, success: 85 },
  { name: '安全', total: 100, success: 88 },
  { name: '性能', total: 100, success: 92 },
];

interface ReportItem {
  category: string;
  total: number;
  success: number;
  rate: number;
}

const mockReportData: ReportItem[] = [
  { category: '网络诊断', total: 50, success: 48, rate: 96 },
  { category: '服务诊断', total: 40, success: 36, rate: 90 },
  { category: '数据库诊断', total: 30, success: 25, rate: 83.3 },
  { category: '安全诊断', total: 35, success: 31, rate: 88.6 },
];

export function DiagnosticReport() {
  const [reportDate, setReportDate] = useState('2026-06-02');

  const stats = {
    totalTasks: mockReportData.reduce((sum, d) => sum + d.total, 0),
    totalSuccess: mockReportData.reduce((sum, d) => sum + d.success, 0),
    avgRate: Math.round(mockReportData.reduce((sum, d) => sum + d.rate, 0) / mockReportData.length),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">诊断报告</h2>
        <p className="text-sm text-gray-400 mt-1">系统诊断的综合报告</p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          导出报告
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">诊断任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalTasks}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功完成</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalSuccess}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均诊断成功率</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.avgRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">诊断类型统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="total" name="总数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" name="成功" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">成功率统计</h3>
          <div className="space-y-3">
            {mockReportData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-[#111827] rounded-full h-2">
                    <div className={`h-2 rounded-full ${item.rate >= 90 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.rate}%` }} />
                  </div>
                  <span className={`text-sm font-medium w-12 text-right ${item.rate >= 90 ? 'text-green-400' : item.rate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">诊断类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">成功</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">成功率</th>
              </tr>
            </thead>
            <tbody>
              {mockReportData.map((item) => (
                <tr key={item.category} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.total}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.success}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.rate >= 90 ? 'bg-green-500' : item.rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.rate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.rate >= 90 ? 'text-green-400' : item.rate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>{item.rate}%</span>
                    </div>
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