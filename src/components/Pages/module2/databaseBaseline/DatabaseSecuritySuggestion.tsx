'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, ArrowRight, Download } from 'lucide-react';

interface Suggestion {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedDatabase: string;
  suggestedAction: string;
  priority: number;
  status: 'pending' | 'in-progress' | 'completed';
}

const mockData: Suggestion[] = [
  { id: 'SUG-001', severity: 'high', title: '启用数据加密', description: 'Oracle-Dev数据库未启用数据存储加密，存在数据泄露风险', affectedDatabase: 'Oracle-Dev', suggestedAction: '启用TDE透明数据加密，配置加密密钥轮换策略', priority: 1, status: 'pending' },
  { id: 'SUG-002', severity: 'high', title: '启用审计日志', description: 'Oracle-Dev和SQLServer-Staging未启用审计日志', affectedDatabase: 'Oracle-Dev, SQLServer-Staging', suggestedAction: '启用数据库审计功能，配置适当的日志级别', priority: 2, status: 'pending' },
  { id: 'SUG-003', severity: 'medium', title: '修复弱密码', description: 'readonly和testuser账户使用弱密码', affectedDatabase: '所有数据库', suggestedAction: '强制密码复杂度要求，定期轮换密码', priority: 3, status: 'in-progress' },
  { id: 'SUG-004', severity: 'medium', title: '配置传输加密', description: 'SQLServer-Staging未启用传输加密', affectedDatabase: 'SQLServer-Staging', suggestedAction: '配置SSL/TLS证书，强制加密连接', priority: 4, status: 'pending' },
  { id: 'SUG-005', severity: 'medium', title: '修复备份失败', description: 'Oracle-Dev全量备份任务失败', affectedDatabase: 'Oracle-Dev', suggestedAction: '检查备份存储路径和权限，重新配置备份任务', priority: 5, status: 'completed' },
  { id: 'SUG-006', severity: 'low', title: '更新参数配置', description: '部分数据库参数配置不符合安全最佳实践', affectedDatabase: 'MySQL-Prod, PostgreSQL-Prod', suggestedAction: '根据安全基线要求调整参数配置', priority: 6, status: 'pending' },
];

export function DatabaseSecuritySuggestion() {
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
        <p className="text-sm text-gray-400 mt-1">基于数据库基线检查结果的安全加固建议</p>
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
                    <span className="text-sm text-gray-400">影响数据库: <span className="text-white">{item.affectedDatabase}</span></span>
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