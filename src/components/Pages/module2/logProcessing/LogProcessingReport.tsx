'use client';

import React, { useState } from 'react';
import { Download, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: '安全日志', count: 150000, processed: 148500 },
  { name: '系统日志', count: 800000, processed: 795000 },
  { name: '应用日志', count: 2000000, processed: 1980000 },
  { name: '网络日志', count: 500000, processed: 495000 },
  { name: '审计日志', count: 120000, processed: 118800 },
];

interface ReportItem {
  category: string;
  total: number;
  processed: number;
  successRate: number;
}

const mockReportData: ReportItem[] = [
  { category: '日志收集', total: 3570000, processed: 3537300, successRate: 99.1 },
  { category: '日志分类', total: 3570000, processed: 3500000, successRate: 98.0 },
  { category: '日志备份', total: 3570000, processed: 3400000, successRate: 95.2 },
  { category: '日志清理', total: 3570000, processed: 3200000, successRate: 89.6 },
];

export function LogProcessingReport() {
  const [reportDate, setReportDate] = useState('2026-06-02');

  const stats = {
    totalLogs: chartData.reduce((sum, d) => sum + d.count, 0),
    totalProcessed: chartData.reduce((sum, d) => sum + d.processed, 0),
    avgSuccessRate: Math.round(chartData.reduce((sum, d) => sum + (d.processed / d.count) * 100, 0) / chartData.length),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志数据处理报告</h2>
        <p className="text-sm text-gray-400 mt-1">日志数据处理的综合报告</p>
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
          <p className="text-gray-400 text-sm">日志总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{(stats.totalLogs / 10000).toFixed(0)}万</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已处理</p>
              <p className="text-xl font-semibold text-green-400">{(stats.totalProcessed / 10000).toFixed(0)}万</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均处理率</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.avgSuccessRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">日志处理统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="count" name="总数" fill="#6B7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="processed" name="已处理" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">处理项统计</h3>
          <div className="space-y-3">
            {mockReportData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-[#111827] rounded-full h-2">
                    <div className={`h-2 rounded-full ${item.successRate >= 95 ? 'bg-green-500' : item.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.successRate}%` }} />
                  </div>
                  <span className={`text-sm font-medium w-12 text-right ${item.successRate >= 95 ? 'text-green-400' : item.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.successRate}%
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">处理分类</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">已处理</th>
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
                  <td className="px-4 py-3 text-sm text-gray-400">{(item.total / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-sm text-green-400">{(item.processed / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.successRate >= 95 ? 'bg-green-500' : item.successRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.successRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.successRate >= 95 ? 'text-green-400' : item.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>{item.successRate}%</span>
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