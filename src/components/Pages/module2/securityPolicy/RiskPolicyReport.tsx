'use client';

import React, { useState } from 'react';
import { Search, Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RiskReport {
  id: string;
  reportName: string;
  reportPeriod: string;
  deviceType: string;
  totalPolicies: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  compliantRate: number;
  generateTime: string;
}

const mockData: RiskReport[] = [
  { id: 'RPT-001', reportName: '安全策略风险统计报告-2026年5月', reportPeriod: '2026-05-01 ~ 2026-05-31', deviceType: '全类型', totalPolicies: 156, highRisk: 12, mediumRisk: 28, lowRisk: 35, compliantRate: 81.4, generateTime: '2026-06-01 00:00:00' },
  { id: 'RPT-002', reportName: '防火墙策略风险分析报告', reportPeriod: '2026-05-20 ~ 2026-05-26', deviceType: '防火墙', totalPolicies: 48, highRisk: 5, mediumRisk: 8, lowRisk: 12, compliantRate: 75.0, generateTime: '2026-05-27 08:00:00' },
  { id: 'RPT-003', reportName: '路由器ACL风险评估报告', reportPeriod: '2026-05-15 ~ 2026-05-21', deviceType: '路由器', totalPolicies: 32, highRisk: 3, mediumRisk: 6, lowRisk: 8, compliantRate: 78.1, generateTime: '2026-05-22 10:00:00' },
  { id: 'RPT-004', reportName: '交换机端口安全风险报告', reportPeriod: '2026-05-10 ~ 2026-05-16', deviceType: '交换机', totalPolicies: 56, highRisk: 4, mediumRisk: 10, lowRisk: 15, compliantRate: 80.4, generateTime: '2026-05-17 09:00:00' },
  { id: 'RPT-005', reportName: '安全策略周度风险报告', reportPeriod: '2026-05-26 ~ 2026-06-01', deviceType: '全类型', totalPolicies: 162, highRisk: 8, mediumRisk: 22, lowRisk: 30, compliantRate: 85.2, generateTime: '2026-06-01 08:00:00' },
];

const riskTrendData = [
  { name: '1月', highRisk: 18, mediumRisk: 35, lowRisk: 42, compliantRate: 72 },
  { name: '2月', highRisk: 15, mediumRisk: 32, lowRisk: 38, compliantRate: 75 },
  { name: '3月', highRisk: 22, mediumRisk: 40, lowRisk: 45, compliantRate: 70 },
  { name: '4月', highRisk: 12, mediumRisk: 28, lowRisk: 35, compliantRate: 80 },
  { name: '5月', highRisk: 10, mediumRisk: 25, lowRisk: 32, compliantRate: 83 },
  { name: '6月', highRisk: 8, mediumRisk: 22, lowRisk: 30, compliantRate: 85 },
];

export function RiskPolicyReport() {
  const [data] = useState<RiskReport[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.reportName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.deviceType.includes(searchKeyword)
  );

  const stats = {
    totalReports: data.length,
    avgCompliance: Math.round(data.reduce((sum, d) => sum + d.compliantRate, 0) / data.length),
    totalHighRisk: data.reduce((sum, d) => sum + d.highRisk, 0),
    totalMediumRisk: data.reduce((sum, d) => sum + d.mediumRisk, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">风险策略报告</h2>
        <p className="text-sm text-gray-400 mt-1">查看时间段内风险策略统计分析报告，支持导出</p>
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
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">高风险策略</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{stats.totalHighRisk}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">中风险策略</p>
          <p className="text-2xl font-semibold text-yellow-400 mt-1">{stats.totalMediumRisk}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">风险趋势分析</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="highRisk" name="高风险" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mediumRisk" name="中风险" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lowRisk" name="低风险" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="搜索报告名称..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">报告名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">报告周期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">高风险</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">中风险</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">低风险</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">生成时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((report) => (
                <tr key={report.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{report.reportName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{report.reportPeriod}</td>
                  <td className="px-4 py-3 text-sm text-white">{report.deviceType}</td>
                  <td className="px-4 py-3 text-sm text-white">{report.totalPolicies}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{report.highRisk}</td>
                  <td className="px-4 py-3 text-sm text-yellow-400">{report.mediumRisk}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{report.lowRisk}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${report.compliantRate >= 80 ? 'bg-green-500' : report.compliantRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${report.compliantRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${report.compliantRate >= 80 ? 'text-green-400' : report.compliantRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{report.compliantRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{report.generateTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看报告"><FileText className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="导出PDF"><Download className="w-4 h-4" /></button>
                    </div>
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
