'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Download } from 'lucide-react';

interface Suggestion {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedComponent: string;
  suggestedAction: string;
  priority: number;
  status: 'pending' | 'in-progress' | 'completed';
}

const mockData: Suggestion[] = [
  { id: 'SUG-001', severity: 'critical', title: '升级Log4j版本', description: '当前版本存在远程代码执行漏洞(CVE-2021-44228)，需立即升级', affectedComponent: 'Log4j 2.14.0', suggestedAction: '升级至最新版本2.20.0，配置log4j2.formatMsgNoLookups=true', priority: 1, status: 'pending' },
  { id: 'SUG-002', severity: 'high', title: '修复Spring Boot漏洞', description: 'Spring Boot存在Spring4Shell远程代码执行漏洞', affectedComponent: 'Spring Boot 2.4.0', suggestedAction: '升级至2.7.12版本，升级相关依赖', priority: 2, status: 'pending' },
  { id: 'SUG-003', severity: 'high', title: '限制管理端口访问', description: '管理控制台端口8080暴露在外网，存在安全风险', affectedComponent: 'Tomcat', suggestedAction: '配置防火墙规则，仅允许内网IP访问管理端口', priority: 3, status: 'in-progress' },
  { id: 'SUG-004', severity: 'medium', title: '启用HTTPS', description: '部分HTTP端口未启用SSL/TLS加密', affectedComponent: 'Nginx', suggestedAction: '配置SSL证书，强制HTTPS访问', priority: 4, status: 'pending' },
  { id: 'SUG-005', severity: 'medium', title: '增强Redis安全配置', description: 'Redis未启用密码认证', affectedComponent: 'Redis', suggestedAction: '设置强密码，绑定内网IP', priority: 5, status: 'completed' },
  { id: 'SUG-006', severity: 'low', title: '调整日志级别', description: '生产环境日志级别设置为DEBUG，可能泄露敏感信息', affectedComponent: '所有中间件', suggestedAction: '生产环境设置为INFO级别', priority: 6, status: 'pending' },
];

export function MiddlewareSecuritySuggestion() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = statusFilter === 'all' 
    ? mockData 
    : mockData.filter(d => d.status === statusFilter);

  const stats = {
    total: mockData.length,
    critical: mockData.filter(d => d.severity === 'critical').length,
    high: mockData.filter(d => d.severity === 'high').length,
    medium: mockData.filter(d => d.severity === 'medium').length,
    pending: mockData.filter(d => d.status === 'pending').length,
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'critical') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">高危</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中危</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低危</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待处理</span>;
    if (status === 'in-progress') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">处理中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已完成</span>;
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'border-l-red-500';
    if (severity === 'high') return 'border-l-orange-500';
    if (severity === 'medium') return 'border-l-yellow-500';
    return 'border-l-blue-500';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">安全加固建议</h2>
        <p className="text-sm text-gray-400 mt-1">基于中间件基线检查结果的安全加固建议</p>
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
              <p className="text-gray-400 text-xs">严重</p>
              <p className="text-xl font-semibold text-red-400">{stats.critical}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">高危</p>
              <p className="text-xl font-semibold text-orange-400">{stats.high}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">中危</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.medium}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">待处理</p>
          <p className="text-2xl font-semibold text-yellow-400 mt-1">{stats.pending}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1E2736] text-gray-400 hover:bg-[#2A354D]'
              }`}
            >
              {status === 'all' ? '全部' : status === 'pending' ? '待处理' : status === 'in-progress' ? '处理中' : '已完成'}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          导出建议
        </button>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className={`bg-[#1E2736] border border-[#2A354D] border-l-4 ${getSeverityColor(item.severity)} rounded-lg p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-medium">{item.title}</h3>
                  {getSeverityBadge(item.severity)}
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-gray-400 mt-2">{item.description}</p>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">影响组件: <span className="text-white">{item.affectedComponent}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">优先级: <span className={`font-medium ${item.priority <= 2 ? 'text-red-400' : item.priority <= 4 ? 'text-yellow-400' : 'text-blue-400'}`}>P{item.priority}</span></span>
                  </div>
                </div>
                <div className="mt-4 bg-[#111827] rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-300 font-medium">建议操作</p>
                      <p className="text-sm text-gray-400 mt-1">{item.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              </div>
              {item.status !== 'completed' && (
                <button className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  开始处理
                </button>
              )}
              {item.status === 'completed' && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">已完成</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}