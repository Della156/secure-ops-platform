'use client';

import React, { useState } from 'react';
import { Search, Download, CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComplianceItem {
  id: string;
  libraryName: string;
  complianceRate: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  totalDevices: number;
  compliantDevices: number;
  nonCompliantDevices: number;
}

const mockData: ComplianceItem[] = [
  { id: 'CMP-001', libraryName: '病毒特征库', complianceRate: 85, status: 'partial', totalDevices: 45, compliantDevices: 38, nonCompliantDevices: 7 },
  { id: 'CMP-002', libraryName: '威胁情报库', complianceRate: 95, status: 'compliant', totalDevices: 38, compliantDevices: 36, nonCompliantDevices: 2 },
  { id: 'CMP-003', libraryName: '漏洞特征库', complianceRate: 50, status: 'non-compliant', totalDevices: 22, compliantDevices: 11, nonCompliantDevices: 11 },
  { id: 'CMP-004', libraryName: '恶意软件库', complianceRate: 92, status: 'compliant', totalDevices: 52, compliantDevices: 48, nonCompliantDevices: 4 },
  { id: 'CMP-005', libraryName: 'URL黑名单', complianceRate: 78, status: 'partial', totalDevices: 48, compliantDevices: 37, nonCompliantDevices: 11 },
  { id: 'CMP-006', libraryName: 'IP信誉库', complianceRate: 98, status: 'compliant', totalDevices: 35, compliantDevices: 34, nonCompliantDevices: 1 },
];

const chartData = mockData.map(d => ({
  name: d.libraryName.replace(/特征库|库$/, ''),
  compliance: d.complianceRate,
}));

export function ComplianceAnalysis() {
  const [data] = useState<ComplianceItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.libraryName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    compliant: data.filter(d => d.status === 'compliant').length,
    partial: data.filter(d => d.status === 'partial').length,
    nonCompliant: data.filter(d => d.status === 'non-compliant').length,
    avgCompliance: Math.round(data.reduce((sum, d) => sum + d.complianceRate, 0) / data.length),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'compliant') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">合规</span>;
    if (status === 'partial') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">部分合规</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">不合规</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">特征库版本合规性分析</h2>
        <p className="text-sm text-gray-400 mt-1">分析各特征库版本的合规状态，识别不合规设备并生成整改建议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">特征库总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">合规</p>
              <p className="text-xl font-semibold text-green-400">{stats.compliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">部分合规</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.partial}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">不合规</p>
              <p className="text-xl font-semibold text-red-400">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">平均合规率</p>
          <p className={`text-2xl font-semibold mt-1 ${stats.avgCompliance >= 80 ? 'text-green-400' : stats.avgCompliance >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{stats.avgCompliance}%</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">合规率分布</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A354D" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1E2736', border: '1px solid #2A354D', borderRadius: '8px' }} />
            <Bar dataKey="compliance" name="合规率%" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">特征库名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备总数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规设备</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">不合规设备</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.libraryName}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.complianceRate >= 80 ? 'bg-green-500' : item.complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.complianceRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.complianceRate >= 80 ? 'text-green-400' : item.complianceRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{item.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.totalDevices}</td>
                  <td className="px-4 py-3 text-sm text-green-400">{item.compliantDevices}</td>
                  <td className="px-4 py-3 text-sm text-red-400">{item.nonCompliantDevices}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
                      查看详情
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