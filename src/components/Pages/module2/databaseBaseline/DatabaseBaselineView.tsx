'use client';

import React, { useState } from 'react';
import { Search, Database, CheckCircle, XCircle, AlertTriangle, Shield, Server } from 'lucide-react';

interface Database {
  id: string;
  name: string;
  type: string;
  version: string;
  host: string;
  port: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  complianceRate: number;
  lastCheck: string;
}

const mockData: Database[] = [
  { id: 'DB-001', name: 'MySQL-Prod', type: 'MySQL', version: '8.0.33', host: '192.168.4.10', port: 3306, status: 'compliant', complianceRate: 95, lastCheck: '2026-06-02 08:30:00' },
  { id: 'DB-002', name: 'PostgreSQL-Prod', type: 'PostgreSQL', version: '15.3', host: '192.168.4.11', port: 5432, status: 'compliant', complianceRate: 92, lastCheck: '2026-06-02 08:35:00' },
  { id: 'DB-003', name: 'Oracle-Dev', type: 'Oracle', version: '19c', host: '192.168.4.12', port: 1521, status: 'partial', complianceRate: 78, lastCheck: '2026-06-02 08:40:00' },
  { id: 'DB-004', name: 'SQLServer-Staging', type: 'SQL Server', version: '2019', host: '192.168.4.13', port: 1433, status: 'non-compliant', complianceRate: 45, lastCheck: '2026-06-02 08:45:00' },
  { id: 'DB-005', name: 'MongoDB-NoSQL', type: 'MongoDB', version: '6.0.5', host: '192.168.4.14', port: 27017, status: 'partial', complianceRate: 82, lastCheck: '2026-06-02 08:50:00' },
];

export function DatabaseBaselineView() {
  const [data] = useState<Database[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.host.includes(searchKeyword)
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

  const getTypeIcon = (type: string) => {
    if (type.includes('MySQL')) return <Database className="w-4 h-4 text-blue-400" />;
    if (type.includes('PostgreSQL')) return <Database className="w-4 h-4 text-green-400" />;
    if (type.includes('Oracle')) return <Database className="w-4 h-4 text-orange-400" />;
    return <Server className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据库基线检查视图</h2>
        <p className="text-sm text-gray-400 mt-1">检查数据库的安全基线配置，确保符合安全标准</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">数据库总数</p>
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

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数据库名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规率</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后检查</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.version}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.host}:{item.port}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#111827] rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.complianceRate >= 80 ? 'bg-green-500' : item.complianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.complianceRate}%` }} />
                      </div>
                      <span className={`text-sm font-medium ${item.complianceRate >= 80 ? 'text-green-400' : item.complianceRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{item.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastCheck}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
                      <Shield className="w-3 h-3 inline mr-1" />
                      详情
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