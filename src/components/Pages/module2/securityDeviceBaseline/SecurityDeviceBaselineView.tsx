'use client';

import React, { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, Server } from 'lucide-react';

interface SecurityDevice {
  id: string;
  name: string;
  type: string;
  model: string;
  ip: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  complianceRate: number;
  lastCheck: string;
}

const mockData: SecurityDevice[] = [
  { id: 'SD-001', name: '防火墙-FW-01', type: '防火墙', model: 'Cisco ASA 5500', ip: '192.168.0.254', status: 'compliant', complianceRate: 95, lastCheck: '2026-06-02 08:00:00' },
  { id: 'SD-002', name: '入侵检测-IDS-01', type: 'IDS', model: 'Snort 3.0', ip: '192.168.1.10', status: 'compliant', complianceRate: 92, lastCheck: '2026-06-02 08:05:00' },
  { id: 'SD-003', name: 'Web防火墙-WAF-01', type: 'WAF', model: 'F5 BIG-IP', ip: '192.168.1.20', status: 'partial', complianceRate: 78, lastCheck: '2026-06-02 08:10:00' },
  { id: 'SD-004', name: 'VPN网关-VPN-01', type: 'VPN', model: 'Fortinet FortiGate', ip: '192.168.0.253', status: 'non-compliant', complianceRate: 45, lastCheck: '2026-06-02 08:15:00' },
  { id: 'SD-005', name: '终端防护-EDR-01', type: 'EDR', model: 'CrowdStrike', ip: '192.168.2.100', status: 'partial', complianceRate: 82, lastCheck: '2026-06-02 08:20:00' },
];

export function SecurityDeviceBaselineView() {
  const [data] = useState<SecurityDevice[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.ip.includes(searchKeyword)
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
    if (type === '防火墙') return <Shield className="w-4 h-4 text-blue-400" />;
    if (type === 'IDS') return <Server className="w-4 h-4 text-red-400" />;
    if (type === 'WAF') return <Shield className="w-4 h-4 text-purple-400" />;
    return <Shield className="w-4 h-4 text-green-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全设备基线检查视图</h2>
        <p className="text-sm text-gray-400 mt-1">检查安全设备的安全基线配置，确保符合安全标准</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">设备总数</p>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">型号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
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
                  <td className="px-4 py-3 text-sm text-gray-400">{item.model}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.ip}</td>
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