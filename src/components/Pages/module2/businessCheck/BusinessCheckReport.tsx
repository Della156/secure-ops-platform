'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, TrendingUp, TrendingDown, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportData {
  date: string;
  totalChecks: number;
  passed: number;
  failed: number;
  warning: number;
}

const mockReportData: ReportData[] = [
  { date: '05-28', totalChecks: 120, passed: 105, failed: 8, warning: 7 },
  { date: '05-29', totalChecks: 125, passed: 110, failed: 6, warning: 9 },
  { date: '05-30', totalChecks: 130, passed: 115, failed: 5, warning: 10 },
  { date: '05-31', totalChecks: 128, passed: 112, failed: 7, warning: 9 },
  { date: '06-01', totalChecks: 135, passed: 120, failed: 5, warning: 10 },
  { date: '06-02', totalChecks: 140, passed: 125, failed: 4, warning: 11 },
];

interface CheckItem {
  id: string;
  serviceName: string;
  checkType: string;
  status: 'pass' | 'fail' | 'warning';
  lastCheckTime: string;
  description: string;
}

const mockCheckItems: CheckItem[] = [
  { id: 'BC-001', serviceName: '用户认证服务', checkType: '接口可用性', status: 'pass', lastCheckTime: '2026-06-02 10:30:00', description: '认证接口响应正常' },
  { id: 'BC-002', serviceName: '数据同步服务', checkType: '数据完整性', status: 'pass', lastCheckTime: '2026-06-02 10:25:00', description: '数据同步正常完成' },
  { id: 'BC-003', serviceName: '消息队列服务', checkType: '队列深度', status: 'warning', lastCheckTime: '2026-06-02 10:20:00', description: '队列积压超过阈值' },
  { id: 'BC-004', serviceName: '缓存服务', checkType: '命中率', status: 'pass', lastCheckTime: '2026-06-02 10:15:00', description: '缓存命中率正常' },
  { id: 'BC-005', serviceName: '数据库服务', checkType: '连接池', status: 'fail', lastCheckTime: '2026-06-02 10:10:00', description: '连接池耗尽' },
];

export function BusinessCheckReport() {
  const [reportData] = useState<ReportData[]>(mockReportData);
  const [checkItems] = useState<CheckItem[]>(mockCheckItems);
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-02' });

  const stats = {
    totalChecks: checkItems.length,
    passed: checkItems.filter(item => item.status === 'pass').length,
    failed: checkItems.filter(item => item.status === 'fail').length,
    warning: checkItems.filter(item => item.status === 'warning').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pass') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />通过</span>;
    if (status === 'fail') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400"><AlertTriangle className="w-3 h-3 inline mr-1" />警告</span>;
  };

  const complianceRate = Math.round((stats.passed / stats.totalChecks) * 100);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">业务功能检查报告</h2>
        <p className="text-sm text-gray-400 mt-1">时间段内业务功能检查统计分析与报告导出</p>
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
          <p className="text-gray-400 text-sm">检查总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalChecks}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.passed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-medium">检查趋势分析</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
                <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E2736', borderColor: '#2A354D' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="passed" name="通过" fill="#22C55E" />
                <Bar dataKey="failed" name="失败" fill="#EF4444" />
                <Bar dataKey="warning" name="警告" fill="#EAB308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-medium">综合合规率</h3>
          </div>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#2A354D" strokeWidth="12" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={complianceRate >= 80 ? '#22C55E' : complianceRate >= 60 ? '#EAB308' : '#EF4444'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${complianceRate * 4.4} 440`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{complianceRate}%</span>
                <span className="text-xs text-gray-400">合规率</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {checkItems.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.serviceName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.checkType}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCheckTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}