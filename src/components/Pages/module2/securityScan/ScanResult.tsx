'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, FileText, Download, Clock, Shield } from 'lucide-react';

interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  target: string;
  status: 'unfixed' | 'pending' | 'fixed';
}

const mockVulnerabilities: Vulnerability[] = [
  { id: 'VULN-001', name: 'CVE-2024-12345', severity: 'critical', cvss: 9.8, target: 'web-server-01', status: 'unfixed' },
  { id: 'VULN-002', name: 'CVE-2024-67890', severity: 'high', cvss: 8.5, target: 'db-server-01', status: 'pending' },
  { id: 'VULN-003', name: '弱密码检测', severity: 'medium', cvss: 6.5, target: 'app-server-01', status: 'unfixed' },
  { id: 'VULN-004', name: 'SQL注入漏洞', severity: 'high', cvss: 8.0, target: 'api-server-01', status: 'fixed' },
  { id: 'VULN-005', name: 'XSS漏洞', severity: 'medium', cvss: 7.0, target: 'web-server-02', status: 'unfixed' },
];

export function ScanResult() {
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const filteredData = selectedSeverity === 'all' 
    ? mockVulnerabilities 
    : mockVulnerabilities.filter(v => v.severity === selectedSeverity);

  const getSeverityBadge = (severity: string) => {
    if (severity === 'critical') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">高</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'unfixed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">未修复</span>;
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">处理中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已修复</span>;
  };

  const stats = {
    total: mockVulnerabilities.length,
    critical: mockVulnerabilities.filter(v => v.severity === 'critical').length,
    high: mockVulnerabilities.filter(v => v.severity === 'high').length,
    medium: mockVulnerabilities.filter(v => v.severity === 'medium').length,
    unfixed: mockVulnerabilities.filter(v => v.status === 'unfixed').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">扫描结果</h2>
        <p className="text-sm text-gray-400 mt-1">扫描报告生成、风险等级分布、漏洞详情查看</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">漏洞总数</p>
              <p className="text-xl font-semibold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">严重漏洞</p>
              <p className="text-xl font-semibold text-red-400">{stats.critical}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">高危漏洞</p>
              <p className="text-xl font-semibold text-orange-400">{stats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">中危漏洞</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.medium}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">未修复</p>
              <p className="text-xl font-semibold text-red-400">{stats.unfixed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">风险等级筛选:</span>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedSeverity(level)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${selectedSeverity === level ? 'bg-blue-600 text-white' : 'bg-[#111827] text-gray-400 hover:bg-[#2A354D]'}`}
                >
                  {level === 'all' ? '全部' : level === 'critical' ? '严重' : level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
        <div className="divide-y divide-[#2A354D]">
          {filteredData.map((item) => (
            <div key={item.id} className="p-4 hover:bg-[#2A354D]/30 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{item.name}</span>
                    {getSeverityBadge(item.severity)}
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                    <span>CVSS: <span className="text-yellow-400">{item.cvss}</span></span>
                    <span>目标: {item.target}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors text-sm">
                  <FileText className="w-4 h-4" />
                  详情
                </button>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
        </div>
      </div>
    </div>
  );
}