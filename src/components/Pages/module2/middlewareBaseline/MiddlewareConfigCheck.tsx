'use client';

import React, { useState } from 'react';
import { Search, Settings, Server, CheckCircle, XCircle, AlertTriangle, Database, Globe, Lock } from 'lucide-react';

interface ConfigItem {
  id: string;
  name: string;
  category: string;
  value: string;
  expectedValue: string;
  status: 'compliant' | 'non-compliant' | 'warning';
  description: string;
  middlewareType: string;
}

const mockData: ConfigItem[] = [
  { id: 'CONF-001', name: '连接超时时间', category: '性能', value: '30s', expectedValue: '30s', status: 'compliant', description: 'HTTP连接超时时间配置', middlewareType: 'Nginx' },
  { id: 'CONF-002', name: '最大连接数', category: '性能', value: '1000', expectedValue: '2000', status: 'non-compliant', description: '服务器最大并发连接数', middlewareType: 'Nginx' },
  { id: 'CONF-003', name: 'SSL协议版本', category: '安全', value: 'TLS 1.2', expectedValue: 'TLS 1.3', status: 'warning', description: 'SSL/TLS协议版本配置', middlewareType: 'Nginx' },
  { id: 'CONF-004', name: '请求体大小限制', category: '安全', value: '10MB', expectedValue: '10MB', status: 'compliant', description: '最大请求体大小', middlewareType: 'Tomcat' },
  { id: 'CONF-005', name: '会话超时', category: '安全', value: '30min', expectedValue: '20min', status: 'non-compliant', description: '用户会话超时时间', middlewareType: 'Tomcat' },
  { id: 'CONF-006', name: '线程池大小', category: '性能', value: '200', expectedValue: '200', status: 'compliant', description: '工作线程池大小', middlewareType: 'Tomcat' },
  { id: 'CONF-007', name: '连接池大小', category: '性能', value: '50', expectedValue: '100', status: 'non-compliant', description: '数据库连接池最大连接数', middlewareType: 'Redis' },
  { id: 'CONF-008', name: '密码复杂度', category: '安全', value: 'medium', expectedValue: 'high', status: 'warning', description: '管理员密码复杂度要求', middlewareType: 'Redis' },
];

export function MiddlewareConfigCheck() {
  const [data] = useState<ConfigItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.middlewareType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    compliant: data.filter(d => d.status === 'compliant').length,
    nonCompliant: data.filter(d => d.status === 'non-compliant').length,
    warning: data.filter(d => d.status === 'warning').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'compliant') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />合规</span>;
    if (status === 'non-compliant') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />不合规</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400"><AlertTriangle className="w-3 h-3 inline mr-1" />警告</span>;
  };

  const getCategoryIcon = (category: string) => {
    if (category === '安全') return <Lock className="w-4 h-4 text-purple-400" />;
    if (category === '性能') return <Server className="w-4 h-4 text-blue-400" />;
    return <Settings className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">中间件配置检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查中间件各项配置参数是否符合安全基线要求</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">配置项总数</p>
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
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">不合规</p>
              <p className="text-xl font-semibold text-red-400">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">警告</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.warning}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索配置项名称或中间件类型..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">配置项</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类别</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">中间件类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前值</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">期望</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="text-sm text-gray-400">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.middlewareType}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">{item.value}</td>
                  <td className="px-4 py-3 text-sm text-green-400 font-mono">{item.expectedValue}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
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