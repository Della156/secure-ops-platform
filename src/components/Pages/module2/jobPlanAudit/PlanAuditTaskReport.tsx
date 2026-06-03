'use client';

import React, { useState } from 'react';
import { Download, Calendar, CheckCircle, XCircle, TrendingUp, AlertTriangle, BarChart3, PieChart, FileSpreadsheet } from 'lucide-react';

interface ReportData {
  month: string;
  total: number;
  approved: number;
  rejected: number;
  complianceIssues: number;
  integrityIssues: number;
}

const mockReportData: ReportData[] = [
  { month: '1月', total: 12, approved: 10, rejected: 2, complianceIssues: 5, integrityIssues: 3 },
  { month: '2月', total: 15, approved: 13, rejected: 2, complianceIssues: 4, integrityIssues: 2 },
  { month: '3月', total: 18, approved: 15, rejected: 3, complianceIssues: 7, integrityIssues: 4 },
  { month: '4月', total: 20, approved: 17, rejected: 3, complianceIssues: 6, integrityIssues: 3 },
  { month: '5月', total: 22, approved: 19, rejected: 3, complianceIssues: 8, integrityIssues: 5 },
  { month: '6月', total: 8, approved: 6, rejected: 2, complianceIssues: 3, integrityIssues: 1 },
];

interface AuditorStats {
  name: string;
  totalAudits: number;
  approved: number;
  rejected: number;
  avgAuditTime: string;
}

const mockAuditorStats: AuditorStats[] = [
  { name: '李经理', totalAudits: 25, approved: 22, rejected: 3, avgAuditTime: '2.5小时' },
  { name: '赵经理', totalAudits: 22, approved: 18, rejected: 4, avgAuditTime: '3.2小时' },
  { name: '钱经理', totalAudits: 18, approved: 15, rejected: 3, avgAuditTime: '2.8小时' },
  { name: '孙经理', totalAudits: 15, approved: 13, rejected: 2, avgAuditTime: '2.1小时' },
];

export function PlanAuditTaskReport() {
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-06-02' });
  const [reportType, setReportType] = useState<'overview' | 'detail'>('overview');

  const totalPlans = mockReportData.reduce((sum, d) => sum + d.total, 0);
  const totalApproved = mockReportData.reduce((sum, d) => sum + d.approved, 0);
  const totalRejected = mockReportData.reduce((sum, d) => sum + d.rejected, 0);
  const totalComplianceIssues = mockReportData.reduce((sum, d) => sum + d.complianceIssues, 0);
  const totalIntegrityIssues = mockReportData.reduce((sum, d) => sum + d.integrityIssues, 0);
  const approvalRate = totalPlans > 0 ? Math.round((totalApproved / totalPlans) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业方案审核任务报告</h2>
        <p className="text-sm text-gray-400 mt-1">任务统计分析、通过率统计、不合规项统计、报告导出</p>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReportType('overview')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  reportType === 'overview' ? 'bg-blue-600 text-white' : 'bg-[#111827] text-gray-400 hover:text-white'
                }`}
              >
                概览
              </button>
              <button
                onClick={() => setReportType('detail')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  reportType === 'detail' ? 'bg-blue-600 text-white' : 'bg-[#111827] text-gray-400 hover:text-white'
                }`}
              >
                明细
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3D4A61] text-white rounded-lg transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              导出Excel
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-xs">审核方案总数</p>
          </div>
          <p className="text-2xl font-semibold text-white">{totalPlans}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-xs">通过方案数</p>
          </div>
          <p className="text-2xl font-semibold text-green-400">{totalApproved}</p>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-gray-400 text-xs">驳回方案数</p>
          </div>
          <p className="text-2xl font-semibold text-red-400">{totalRejected}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-400 text-xs">通过率</p>
          </div>
          <p className="text-2xl font-semibold text-yellow-400">{approvalRate}%</p>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <p className="text-gray-400 text-xs">问题总数</p>
          </div>
          <p className="text-2xl font-semibold text-orange-400">{totalComplianceIssues + totalIntegrityIssues}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">审核趋势</h3>
          <div className="h-64 flex items-end justify-around gap-2">
            {mockReportData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex flex-col gap-1 w-full">
                  <div
                    className="bg-green-500/60 rounded-t"
                    style={{ height: `${(item.approved / Math.max(...mockReportData.map(d => d.total))) * 200}px` }}
                  />
                  <div
                    className="bg-red-500/60 rounded-b"
                    style={{ height: `${(item.rejected / Math.max(...mockReportData.map(d => d.total))) * 200}px` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500/60 rounded" />
              <span className="text-gray-400">通过</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/60 rounded" />
              <span className="text-gray-400">驳回</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">问题分布</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131B2A] p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-orange-400">{totalComplianceIssues}</p>
                  <p className="text-xs text-gray-400">合规性问题</p>
                </div>
              </div>
            </div>
            <div className="bg-[#131B2A] p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-purple-400">{totalIntegrityIssues}</p>
                  <p className="text-xs text-gray-400">完整性问题</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">审核员统计</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">审核员</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">审核总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">通过数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">驳回数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">平均审核时间</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditorStats.map((item, index) => (
                <tr key={index} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.totalAudits}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.approved}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.rejected}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.avgAuditTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}