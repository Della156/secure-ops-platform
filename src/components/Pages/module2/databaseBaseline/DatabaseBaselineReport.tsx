'use client';

import React, { useState } from 'react';
import { Download, Calendar, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const complianceData = [
  { name: 'MySQL', compliant: 95, nonCompliant: 5 },
  { name: 'PostgreSQL', compliant: 92, nonCompliant: 8 },
  { name: 'Oracle', compliant: 78, nonCompliant: 22 },
  { name: 'SQL Server', compliant: 45, nonCompliant: 55 },
  { name: 'MongoDB', compliant: 82, nonCompliant: 18 },
];

interface ReportItem {
  category: string;
  total: number;
  pass: number;
  fail: number;
  passRate: number;
}

const mockReportData: ReportItem[] = [
  { category: '账户权限', total: 15, pass: 12, fail: 3, passRate: 80 },
  { category: '数据加密', total: 10, pass: 6, fail: 4, passRate: 60 },
  { category: '审计日志', total: 8, pass: 5, fail: 3, passRate: 62 },
  { category: '参数安全', total: 12, pass: 8, fail: 4, passRate: 67 },
  { category: '备份恢复', total: 6, pass: 4, fail: 2, passRate: 67 },
];

export function DatabaseBaselineReport() {
  const [reportDate, setReportDate] = useState('2026-06-02');

  const stats = {
    totalChecks: mockReportData.reduce((sum, d) => sum + d.total, 0),
    totalPass: mockReportData.reduce((sum, d) => sum + d.pass, 0),
    totalFail: mockReportData.reduce((sum, d) => sum + d.fail, 0),
    overallPassRate: Math.round(mockReportData.reduce((sum, d) => sum + d.pass, 0) / mockReportData.reduce((sum, d) => sum + d.total, 0) * 100),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据库基线检查报告</h2>
        <p className="text-sm text-gray-400 mt-1">数据库安全基线检查的综合报告</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">检查项总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalChecks}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalPass}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.totalFail}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">总体通过率</p>
          <p className={`text-2xl font-semibold mt-1 ${stats.overallPassRate >= 80 ? 'text-green-400' : stats.overallPassRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {stats.overallPassRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">数据库合规率分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={complianceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D' }} />
              <Legend />
              <Bar dataKey="compliant" name="合规" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nonCompliant" name="不合规" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">检查项分类统计</h3>
          <div className="space-y-3">
            {mockReportData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-[#111827] rounded-full h-2">
                    <div className={`h-2 rounded-full ${item.passRate >= 80 ? 'bg-green-500' : item.passRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.passRate}%` }} />
                  </div>
                  <span className={`text-sm font-medium w-12 text-right ${item.passRate >= 80 ? 'text-green-400' : item.passRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {item.passRate}%
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查分类</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查项数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">通过</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">失败</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">通过率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
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
                  <td className="px-4 py-3 text-sm text-green-400">{item.pass}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.fail}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.passRate >= 80 ? 'bg-green-500' : item.passRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.passRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.passRate >= 80 ? 'text-green-400' : item.passRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{item.passRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {item.passRate >= 80 ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        通过
                      </span>
                    ) : item.passRate >= 60 ? (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        警告
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        失败
                      </span>
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