'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CheckReport {
  id: string;
  reportName: string;
  deviceType: string;
  checkScope: string;
  totalDevices: number;
  normalDevices: number;
  abnormalDevices: number;
  offlineDevices: number;
  complianceRate: number;
  reportPeriod: string;
  generateTime: string;
  generateBy: string;
}

const mockData: CheckReport[] = [
  { id: 'RPT-001', reportName: '2026年6月第1周设备运行状态检查报告', deviceType: '全类型', checkScope: '全部设备', totalDevices: 48, normalDevices: 38, abnormalDevices: 6, offlineDevices: 4, complianceRate: 79.2, reportPeriod: '2026-05-26 ~ 2026-06-01', generateTime: '2026-06-01 08:00:00', generateBy: '系统自动' },
  { id: 'RPT-002', reportName: '2026年5月设备运行状态月度报告', deviceType: '全类型', checkScope: '全部设备', totalDevices: 52, normalDevices: 42, abnormalDevices: 7, offlineDevices: 3, complianceRate: 80.8, reportPeriod: '2026-05-01 ~ 2026-05-31', generateTime: '2026-06-01 00:30:00', generateBy: '系统自动' },
  { id: 'RPT-003', reportName: '防火墙专项检查报告', deviceType: '防火墙', checkScope: '边界防火墙', totalDevices: 8, normalDevices: 7, abnormalDevices: 1, offlineDevices: 0, complianceRate: 87.5, reportPeriod: '2026-05-20 ~ 2026-05-27', generateTime: '2026-05-27 18:00:00', generateBy: 'admin' },
  { id: 'RPT-004', reportName: '核心网络设备健康度报告', deviceType: '交换机/路由器', checkScope: '核心设备', totalDevices: 12, normalDevices: 10, abnormalDevices: 1, offlineDevices: 1, complianceRate: 83.3, reportPeriod: '2026-05-15 ~ 2026-05-22', generateTime: '2026-05-22 10:00:00', generateBy: 'system' },
  { id: 'RPT-005', reportName: '服务器运行状态周报', deviceType: '服务器', checkScope: '生产服务器', totalDevices: 20, normalDevices: 16, abnormalDevices: 3, offlineDevices: 1, complianceRate: 80.0, reportPeriod: '2026-05-19 ~ 2026-05-25', generateTime: '2026-05-25 20:00:00', generateBy: '系统自动' },
];

const trendData = [
  { name: '1月', compliance: 75, abnormal: 12, offline: 5 },
  { name: '2月', compliance: 78, abnormal: 10, offline: 4 },
  { name: '3月', compliance: 72, abnormal: 15, offline: 6 },
  { name: '4月', compliance: 80, abnormal: 8, offline: 3 },
  { name: '5月', compliance: 81, abnormal: 7, offline: 3 },
  { name: '6月', compliance: 79, abnormal: 6, offline: 4 },
];

export function StatusReport() {
  const [data] = useState<CheckReport[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredData = data.filter(d => {
    const matchKeyword = !searchKeyword || d.reportName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.deviceType.includes(searchKeyword);
    return matchKeyword;
  });

  const stats = {
    totalReports: data.length,
    avgCompliance: Math.round(data.reduce((sum, d) => sum + d.complianceRate, 0) / data.length),
    totalDevices: data.reduce((sum, d) => sum + d.totalDevices, 0),
    abnormalCount: data.reduce((sum, d) => sum + d.abnormalDevices, 0),
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-blue-400';
    if (rate >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">运行状态检查报告</h2>
        <p className="text-sm text-gray-400 mt-1">查看和管理设备运行状态检查统计分析报告，支持报告导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">报告总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalReports}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均合规率</p>
          <p className={`text-2xl font-semibold mt-1 ${getComplianceColor(stats.avgCompliance)}`}>{stats.avgCompliance}%</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">累计检查设备</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalDevices}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">异常设备数</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">{stats.abnormalCount}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索报告名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <FileText className="w-4 h-4" />
            生成报告
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">报告名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查范围</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备统计</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">报告周期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">生成时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((report) => (
                <tr key={report.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{report.reportName}</td>
                  <td className="px-4 py-3 text-sm text-white">{report.deviceType}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{report.checkScope}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">正常 <span className="text-green-400">{report.normalDevices}</span></span>
                      <span className="text-gray-400">异常 <span className="text-red-400">{report.abnormalDevices}</span></span>
                      <span className="text-gray-400">离线 <span className="text-gray-400">{report.offlineDevices}</span></span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${report.complianceRate >= 80 ? 'bg-green-500' : report.complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${report.complianceRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${getComplianceColor(report.complianceRate)}`}>{report.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{report.reportPeriod}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <div>{report.generateTime}</div>
                    <div className="text-xs text-gray-500">{report.generateBy}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看报告">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="导出PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">报告趋势分析</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="compliance" name="合规率(%)" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="abnormal" name="异常设备数" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="offline" name="离线设备数" stroke="#9CA3AF" strokeWidth={2} dot={{ fill: '#9CA3AF', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
