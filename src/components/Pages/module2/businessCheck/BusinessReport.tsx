'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportItem {
  id: string;
  reportName: string;
  reportPeriod: string;
  totalServices: number;
  healthyServices: number;
  warningServices: number;
  errorServices: number;
  avgHealthScore: number;
  generateTime: string;
}

const mockData: ReportItem[] = [
  { id: 'RPT-001', reportName: '业务功能检查日报-20260602', reportPeriod: '2026-06-02', totalServices: 5, healthyServices: 3, warningServices: 1, errorServices: 1, avgHealthScore: 82, generateTime: '2026-06-02 08:00:00' },
  { id: 'RPT-002', reportName: '业务功能检查日报-20260601', reportPeriod: '2026-06-01', totalServices: 5, healthyServices: 4, warningServices: 1, errorServices: 0, avgHealthScore: 90, generateTime: '2026-06-01 08:00:00' },
  { id: 'RPT-003', reportName: '业务功能检查周报-第22周', reportPeriod: '2026-05-26 ~ 2026-06-01', totalServices: 5, healthyServices: 20, warningServices: 5, errorServices: 2, avgHealthScore: 88, generateTime: '2026-06-01 00:00:00' },
];

const trendData = [
  { name: '5/27', avgScore: 85, healthy: 4, warning: 1, error: 0 },
  { name: '5/28', avgScore: 88, healthy: 4, warning: 1, error: 0 },
  { name: '5/29', avgScore: 86, healthy: 3, warning: 2, error: 0 },
  { name: '5/30', avgScore: 82, healthy: 3, warning: 1, error: 1 },
  { name: '5/31', avgScore: 90, healthy: 4, warning: 1, error: 0 },
  { name: '6/1', avgScore: 90, healthy: 4, warning: 1, error: 0 },
  { name: '6/2', avgScore: 82, healthy: 3, warning: 1, error: 1 },
];

export function BusinessReport() {
  const [data] = useState<ReportItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.reportName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    totalReports: data.length,
    avgScore: Math.round(data.reduce((sum, d) => sum + d.avgHealthScore, 0) / data.length),
    totalHealthy: data.reduce((sum, d) => sum + d.healthyServices, 0),
    totalWarning: data.reduce((sum, d) => sum + d.warningServices, 0),
    totalError: data.reduce((sum, d) => sum + d.errorServices, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">业务功能检查报告</h2>
        <p className="text-sm text-gray-400 mt-1">查看业务功能检查的统计分析报告，支持报告导出</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">报告总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalReports}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均健康度</p>
          <p className={`text-2xl font-semibold mt-1 ${stats.avgScore >= 90 ? 'text-green-400' : stats.avgScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{stats.avgScore}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">健康服务</p>
              <p className="text-xl font-semibold text-green-400">{stats.totalHealthy}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">告警服务</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.totalWarning}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">异常服务</p>
              <p className="text-xl font-semibold text-red-400">{stats.totalError}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">健康度趋势</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="avgScore" name="平均健康度" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="healthy" name="健康服务数" stroke="#22C55E" strokeWidth={2} />
            <Line type="monotone" dataKey="error" name="异常服务数" stroke="#EF4444" strokeWidth={2} />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">服务总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">健康服务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">告警服务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">异常服务</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">平均健康度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">生成时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{item.reportName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.reportPeriod}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.totalServices}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.healthyServices}</td>
                  <td className="px-4 py-3 text-sm text-yellow-400">{item.warningServices}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.errorServices}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.avgHealthScore}</td>
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