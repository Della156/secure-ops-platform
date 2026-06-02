'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportItem {
  id: string;
  reportName: string;
  reportPeriod: string;
  totalChecks: number;
  passCount: number;
  warningCount: number;
  failCount: number;
  complianceRate: number;
  generateTime: string;
}

const mockData: ReportItem[] = [
  { id: 'RPT-001', reportName: '操作系统基线检查日报-20260602', reportPeriod: '2026-06-02', totalChecks: 25, passCount: 18, warningCount: 4, failCount: 3, complianceRate: 72, generateTime: '2026-06-02 08:00:00' },
  { id: 'RPT-002', reportName: '操作系统基线检查日报-20260601', reportPeriod: '2026-06-01', totalChecks: 25, passCount: 20, warningCount: 3, failCount: 2, complianceRate: 80, generateTime: '2026-06-01 08:00:00' },
  { id: 'RPT-003', reportName: '操作系统基线检查周报-第22周', reportPeriod: '2026-05-26 ~ 2026-06-01', totalChecks: 125, passCount: 95, warningCount: 18, failCount: 12, complianceRate: 76, generateTime: '2026-06-01 00:00:00' },
];

const trendData = [
  { name: '5/27', compliance: 70, pass: 17, fail: 4 },
  { name: '5/28', compliance: 75, pass: 19, fail: 3 },
  { name: '5/29', compliance: 72, pass: 18, fail: 4 },
  { name: '5/30', compliance: 78, pass: 19, fail: 3 },
  { name: '5/31', compliance: 80, pass: 20, fail: 2 },
  { name: '6/1', compliance: 80, pass: 20, fail: 2 },
  { name: '6/2', compliance: 72, pass: 18, fail: 3 },
];

export function OsBaselineReport() {
  const [data] = useState<ReportItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.reportName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    totalReports: data.length,
    avgCompliance: Math.round(data.reduce((sum, d) => sum + d.complianceRate, 0) / data.length),
    totalPass: data.reduce((sum, d) => sum + d.passCount, 0),
    totalWarning: data.reduce((sum, d) => sum + d.warningCount, 0),
    totalFail: data.reduce((sum, d) => sum + d.failCount, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">操作系统基线检查报告</h2>
        <p className="text-sm text-gray-400 mt-1">查看操作系统基线检查的统计分析报告，支持报告导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">报告总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalReports}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均合规率</p>
          <p className={`text-2xl font-semibold mt-1 ${stats.avgCompliance >= 80 ? 'text-green-400' : stats.avgCompliance >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{stats.avgCompliance}%</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过项</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalPass}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告项</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.totalWarning}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败项</p>
              <p className="text-xl font-semibold text-red-400">{stats.totalFail}</p>
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
            <Line type="monotone" dataKey="compliance" name="合规率%" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="pass" name="通过数" stroke="#22C55E" strokeWidth={2} />
            <Line type="monotone" dataKey="fail" name="失败数" stroke="#EF4444" strokeWidth={2} />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查项总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">通过</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">警告</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">失败</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">生成时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{item.reportName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.reportPeriod}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.totalChecks}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.passCount}</td>
                  <td className="px-4 py-3 text-sm text-yellow-400">{item.warningCount}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.failCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.complianceRate >= 80 ? 'bg-green-500' : item.complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.complianceRate}%` }} />
                      </div>
                      <span className={`text-sm ${item.complianceRate >= 80 ? 'text-green-400' : item.complianceRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{item.complianceRate}%</span>
                    </div>
                  </td>
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