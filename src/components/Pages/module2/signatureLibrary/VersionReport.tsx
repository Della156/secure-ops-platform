'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportItem {
  id: string;
  reportName: string;
  reportPeriod: string;
  totalLibraries: number;
  updatedLibraries: number;
  notUpdatedLibraries: number;
  avgCompliance: number;
  generateTime: string;
}

const mockData: ReportItem[] = [
  { id: 'RPT-001', reportName: '特征库版本周报-第22周', reportPeriod: '2026-06-02 ~ 2026-06-08', totalLibraries: 6, updatedLibraries: 4, notUpdatedLibraries: 2, avgCompliance: 83, generateTime: '2026-06-02 08:00:00' },
  { id: 'RPT-002', reportName: '特征库版本周报-第21周', reportPeriod: '2026-05-26 ~ 2026-06-01', totalLibraries: 6, updatedLibraries: 3, notUpdatedLibraries: 3, avgCompliance: 78, generateTime: '2026-05-26 08:00:00' },
  { id: 'RPT-003', reportName: '特征库版本月报-2026年5月', reportPeriod: '2026-05-01 ~ 2026-05-31', totalLibraries: 6, updatedLibraries: 24, notUpdatedLibraries: 12, avgCompliance: 75, generateTime: '2026-06-01 00:00:00' },
];

const trendData = [
  { name: '第19周', avgCompliance: 72, updated: 2, notUpdated: 4 },
  { name: '第20周', avgCompliance: 75, updated: 3, notUpdated: 3 },
  { name: '第21周', avgCompliance: 78, updated: 3, notUpdated: 3 },
  { name: '第22周', avgCompliance: 83, updated: 4, notUpdated: 2 },
];

export function VersionReport() {
  const [data] = useState<ReportItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.reportName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    totalReports: data.length,
    avgCompliance: Math.round(data.reduce((sum, d) => sum + d.avgCompliance, 0) / data.length),
    totalUpdated: data.reduce((sum, d) => sum + d.updatedLibraries, 0),
    totalNotUpdated: data.reduce((sum, d) => sum + d.notUpdatedLibraries, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">特征库版本号报告</h2>
        <p className="text-sm text-gray-400 mt-1">查看特征库版本检查的统计分析报告，支持报告导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">报告总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalReports}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均合规率</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">{stats.avgCompliance}%</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已更新特征库</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalUpdated}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">未更新特征库</p>
              <p className="text-xl font-semibold text-red-400">{stats.totalNotUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">合规率趋势</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="avgCompliance" name="合规率%" stroke="#22C55E" strokeWidth={2} />
            <Line type="monotone" dataKey="updated" name="已更新数" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="notUpdated" name="未更新数" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">报告名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">报告周期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">特征库总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">已更新</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">未更新</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">平均合规率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">生成时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{item.reportName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.reportPeriod}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.totalLibraries}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.updatedLibraries}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.notUpdatedLibraries}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.avgCompliance}%</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.generateTime}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors mr-2">
                      <FileText className="w-3 h-3 inline mr-1" />
                      查看
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg transition-colors">
                      <Download className="w-3 h-3 inline mr-1" />
                      导出
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}