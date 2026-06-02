'use client';

import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Send, Copy, Download, ChevronRight, Shield } from 'lucide-react';

interface HardeningItem {
  id: string;
  hostname: string;
  ip: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  issueTitle: string;
  issueDescription: string;
  suggestion: string;
  status: 'pending' | 'sent' | 'acknowledged';
  targetUser: string;
  relatedCheck: string;
}

const mockData: HardeningItem[] = [
  { id: 'HS-001', hostname: 'server-03', ip: '192.168.2.12', category: '账户安全', severity: 'high', issueTitle: '禁用root远程登录', issueDescription: '检测到root账户允许远程SSH登录，存在安全风险', suggestion: '修改/etc/ssh/sshd_config，设置PermitRootLogin no，然后重启sshd服务', status: 'pending', targetUser: '运维组', relatedCheck: '账户与口令策略检查' },
  { id: 'HS-002', hostname: 'server-03', ip: '192.168.2.12', category: '网络安全', severity: 'high', issueTitle: '禁用ICMP Echo响应', issueDescription: '系统响应ICMP Echo请求，可能被用于网络探测', suggestion: '设置net.ipv4.icmp_echo_ignore_all=1，可临时使用sysctl -w命令，或写入/etc/sysctl.conf永久生效', status: 'sent', targetUser: '运维组', relatedCheck: '内核与系统参数检查' },
  { id: 'HS-003', hostname: 'server-02', ip: '192.168.2.11', category: '安全策略', severity: 'medium', issueTitle: '提高地址空间随机化级别', issueDescription: '当前kernel.randomize_va_space值为1，建议设置为2以提高安全性', suggestion: '设置kernel.randomize_va_space=2，可临时使用sysctl -w命令，或写入/etc/sysctl.conf永久生效', status: 'acknowledged', targetUser: '运维组', relatedCheck: '内核与系统参数检查' },
  { id: 'HS-004', hostname: 'server-03', ip: '192.168.2.12', category: '漏洞修复', severity: 'high', issueTitle: '修复CVE-2024-5678', issueDescription: '存在未修复的严重级漏洞CVE-2024-5678', suggestion: '及时升级相关软件包至安全版本，参考厂商安全公告', status: 'pending', targetUser: '安全组', relatedCheck: '系统补丁与漏洞检查' },
  { id: 'HS-005', hostname: 'server-01', ip: '192.168.2.10', category: '日志审计', severity: 'medium', issueTitle: '调整日志文件权限', issueDescription: '部分日志文件权限过松，可能导致敏感信息泄露', suggestion: '检查并修改/var/log目录下文件权限，建议设置为640或更严格', status: 'pending', targetUser: '运维组', relatedCheck: '日志与审计策略检查' },
];

export function HardeningSuggestion() {
  const [data, setData] = useState<HardeningItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.issueTitle.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    high: data.filter(d => d.severity === 'high').length,
    medium: data.filter(d => d.severity === 'medium').length,
    low: data.filter(d => d.severity === 'low').length,
    pending: data.filter(d => d.status === 'pending').length,
    sent: data.filter(d => d.status === 'sent').length,
    acknowledged: data.filter(d => d.status === 'acknowledged').length,
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高危</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中危</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低危</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待推送</span>;
    if (status === 'sent') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">已推送</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已确认</span>;
  };

  const handlePush = (id: string) => {
    setData(data.map(item => 
      item.id === id ? { ...item, status: 'sent' } : item
    ));
  };

  const handleBulkPush = () => {
    setData(data.map(item => 
      item.status === 'pending' ? { ...item, status: 'sent' } : item
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全加固建议</h2>
        <p className="text-sm text-gray-400 mt-1">针对检查出的不合规项，自动生成加固建议，支持一键推送至运维人员</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">高危建议</p>
              <p className="text-xl font-semibold text-red-400">{stats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">中危建议</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.medium}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">待推送</p>
              <p className="text-xl font-semibold text-blue-400">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索主机名或问题标题..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出建议
            </button>
            <button 
              onClick={handleBulkPush}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Send className="w-4 h-4" />
              一键推送全部
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">{item.hostname}</span>
                  <span className="text-xs text-gray-500 font-mono">{item.ip}</span>
                  {getSeverityBadge(item.severity)}
                  {getStatusBadge(item.status)}
                </div>
                <h3 className="text-white font-medium mb-1">{item.issueTitle}</h3>
                <p className="text-sm text-gray-400 mb-3">{item.issueDescription}</p>
                <div className="bg-[#111827] border border-[#2A354D] rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">加固建议</p>
                  <p className="text-sm text-green-400">{item.suggestion}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>关联检查: {item.relatedCheck}</span>
                  <span>推送目标: {item.targetUser}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {item.status === 'pending' && (
                  <button 
                    onClick={() => handlePush(item.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                    <Send className="w-4 h-4" />
                    推送
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors text-sm">
                  <Copy className="w-4 h-4" />
                  复制建议
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}