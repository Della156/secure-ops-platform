'use client';

import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, ChevronRight, Download } from 'lucide-react';

interface SuggestionItem {
  id: string;
  hostname: string;
  ip: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion: string;
  status: 'pending' | 'in-progress' | 'completed';
  relatedCheck: string;
}

const mockData: SuggestionItem[] = [
  { id: 'SG-001', hostname: 'server-03', ip: '192.168.2.12', category: '账户安全', severity: 'high', title: '禁用root远程登录', description: '检测到root账户允许远程SSH登录，存在安全风险', suggestion: '修改/etc/ssh/sshd_config，设置PermitRootLogin no，然后重启sshd服务', status: 'pending', relatedCheck: '账户与口令策略检查' },
  { id: 'SG-002', hostname: 'server-03', ip: '192.168.2.12', category: '网络安全', severity: 'high', title: '禁用ICMP Echo响应', description: '系统响应ICMP Echo请求，可能被用于网络探测', suggestion: '设置net.ipv4.icmp_echo_ignore_all=1，可临时使用sysctl -w命令，或写入/etc/sysctl.conf永久生效', status: 'pending', relatedCheck: '内核与系统参数检查' },
  { id: 'SG-003', hostname: 'server-02', ip: '192.168.2.11', category: '安全策略', severity: 'medium', title: '提高地址空间随机化级别', description: '当前kernel.randomize_va_space值为1，建议设置为2以提高安全性', suggestion: '设置kernel.randomize_va_space=2，可临时使用sysctl -w命令，或写入/etc/sysctl.conf永久生效', status: 'pending', relatedCheck: '内核与系统参数检查' },
  { id: 'SG-004', hostname: 'server-03', ip: '192.168.2.12', category: '漏洞修复', severity: 'high', title: '修复CVE-2024-5678', description: '存在未修复的严重级漏洞CVE-2024-5678', suggestion: '及时升级相关软件包至安全版本，参考厂商安全公告', status: 'pending', relatedCheck: '系统补丁与漏洞检查' },
  { id: 'SG-005', hostname: 'server-02', ip: '192.168.2.11', category: '日志审计', severity: 'medium', title: '调整日志文件权限', description: '部分日志文件权限过松，可能导致敏感信息泄露', suggestion: '检查并修改/var/log目录下文件权限，建议设置为640或更严格', status: 'in-progress', relatedCheck: '日志与审计策略检查' },
];

export function OsSecuritySuggestion() {
  const [data] = useState<SuggestionItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.hostname.toLowerCase().includes(searchKeyword.toLowerCase()) || d.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    high: data.filter(d => d.severity === 'high').length,
    medium: data.filter(d => d.severity === 'medium').length,
    low: data.filter(d => d.severity === 'low').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高危</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中危</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低危</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
    if (status === 'in-progress') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">处理中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待处理</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全加固建议</h2>
        <p className="text-sm text-gray-400 mt-1">根据基线检查结果，提供针对性的安全加固建议</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">建议总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
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
          <p className="text-gray-400 text-sm">低危建议</p>
          <p className="text-2xl font-semibold text-blue-400 mt-1">{stats.low}</p>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">待处理</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.pending}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">主机名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">分类</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">严重程度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">建议标题</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">加固建议</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{item.hostname}</div>
                    <div className="text-xs text-gray-500">{item.ip}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.category}</span>
                  </td>
                  <td className="px-4 py-3">{getSeverityBadge(item.severity)}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.suggestion}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
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