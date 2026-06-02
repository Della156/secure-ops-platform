'use client';

import React, { useState } from 'react';
import { Search, Download, Eye, RefreshCw, Filter, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface SecurityPolicyItem {
  id: string;
  policyName: string;
  policyType: string;
  device: string;
  policyContent: string;
  complianceStatus: 'compliant' | 'non-compliant' | 'unchecked';
  checkResult: string;
  checkTime: string;
}

const mockData: SecurityPolicyItem[] = [
  { id: 'POL-001', policyName: 'HTTP访问控制策略', policyType: '访问控制', device: 'FW-边界防火墙-01', policyContent: '拒绝源IP 10.0.0.0/8 访问HTTP服务', complianceStatus: 'compliant', checkResult: '策略已生效', checkTime: '2026-06-01 10:30:00' },
  { id: 'POL-002', policyName: 'SSH访问限制策略', policyType: '访问控制', device: 'FW-边界防火墙-01', policyContent: '仅允许特定IP段SSH访问', complianceStatus: 'compliant', checkResult: '策略已生效', checkTime: '2026-06-01 10:30:00' },
  { id: 'POL-003', policyName: 'NAT地址转换策略', policyType: 'NAT', device: 'FW-边界防火墙-02', policyContent: '内部网络地址转换配置', complianceStatus: 'non-compliant', checkResult: '配置与基线不符', checkTime: '2026-06-01 10:25:00' },
  { id: 'POL-004', policyName: 'IPS入侵防护策略', policyType: 'IPS', device: 'IDS-入侵检测-01', policyContent: '启用SQL注入防护规则', complianceStatus: 'compliant', checkResult: '规则已启用', checkTime: '2026-06-01 10:28:00' },
  { id: 'POL-005', policyName: 'WAF应用防护策略', policyType: 'WAF', device: 'WAF-Web防火墙-01', policyContent: 'XSS防护规则配置', complianceStatus: 'unchecked', checkResult: '待检查', checkTime: '-' },
  { id: 'POL-006', policyName: 'SSL VPN认证策略', policyType: 'VPN', device: 'VPN-网关-01', policyContent: '双因素认证配置', complianceStatus: 'non-compliant', checkResult: '未启用双因素', checkTime: '2026-06-01 10:20:00' },
  { id: 'POL-007', policyName: '数据库访问控制', policyType: '访问控制', device: 'DB-数据库-01', policyContent: '限制外部访问数据库端口', complianceStatus: 'compliant', checkResult: '策略已生效', checkTime: '2026-06-01 10:15:00' },
  { id: 'POL-008', policyName: '端口扫描防护', policyType: '安全策略', device: 'FW-边界防火墙-01', policyContent: '启用端口扫描检测与阻断', complianceStatus: 'compliant', checkResult: '防护已启用', checkTime: '2026-06-01 10:30:00' },
];

export function SecurityPolicyView() {
  const [data] = useState<SecurityPolicyItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredData = data.filter(item => {
    const matchKeyword = !searchKeyword || item.policyName.toLowerCase().includes(searchKeyword.toLowerCase()) || item.device.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus = !filterStatus || item.complianceStatus === filterStatus;
    const matchType = !filterType || item.policyType === filterType;
    return matchKeyword && matchStatus && matchType;
  });

  const stats = {
    total: data.length,
    compliant: data.filter(d => d.complianceStatus === 'compliant').length,
    nonCompliant: data.filter(d => d.complianceStatus === 'non-compliant').length,
    unchecked: data.filter(d => d.complianceStatus === 'unchecked').length,
  };

  const getStatusBadge = (status: string) => {
    const config = {
      compliant: { bg: 'bg-green-500/20 text-green-400', label: '合规', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      'non-compliant': { bg: 'bg-red-500/20 text-red-400', label: '不合规', icon: <XCircle className="w-3 h-3 mr-1" /> },
      unchecked: { bg: 'bg-gray-500/20 text-gray-400', label: '未检查', icon: <Clock className="w-3 h-3 mr-1" /> },
    };
    const { bg, label, icon } = config[status as keyof typeof config];
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg}`}>{icon}{label}</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全策略检查视图</h2>
        <p className="text-sm text-gray-400 mt-1">查看所有安全策略的合规状态，支持按策略类型、合规状态筛选</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">策略总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">合规策略</p>
              <p className="text-2xl font-semibold text-green-400 mt-1">{stats.compliant}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400/30" />
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">不合规策略</p>
              <p className="text-2xl font-semibold text-red-400 mt-1">{stats.nonCompliant}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400/30" />
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">未检查</p>
              <p className="text-2xl font-semibold text-gray-400 mt-1">{stats.unchecked}</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400/30" />
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索策略名称/设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部状态</option>
              <option value="compliant">合规</option>
              <option value="non-compliant">不合规</option>
              <option value="unchecked">未检查</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">全部类型</option>
              <option value="访问控制">访问控制</option>
              <option value="NAT">NAT</option>
              <option value="IPS">IPS</option>
              <option value="WAF">WAF</option>
              <option value="VPN">VPN</option>
              <option value="安全策略">安全策略</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#2A354D] text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">应用设备</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">策略内容摘要</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">合规状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">检查时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-gray-400">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-[#60A5FA] cursor-pointer hover:underline">{item.policyName}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.policyType}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{item.device}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">{item.policyContent}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.complianceStatus)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.checkTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors" title="查看详情"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="检查过程"><Clock className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded transition-colors" title="查看结果"><AlertTriangle className="w-4 h-4" /></button>
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
