'use client';

import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Shield, ChevronRight, Download } from 'lucide-react';

interface SuggestionItem {
  id: string;
  middlewareName: string;
  type: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  issueTitle: string;
  issueDescription: string;
  suggestion: string;
  status: 'pending' | 'generated';
  relatedCheck: string;
}

const mockData: SuggestionItem[] = [
  { id: 'MW-SG-001', middlewareName: 'Nginx-01', type: 'Nginx', category: '安全配置', severity: 'high', issueTitle: '禁用不必要的HTTP方法', issueDescription: '检测到服务器允许TRACE、DELETE等危险HTTP方法', suggestion: '在nginx配置中添加：if ($request_method !~ ^(GET|HEAD|POST)$ ) { return 405; }', status: 'generated', relatedCheck: '访问控制与权限检查' },
  { id: 'MW-SG-002', middlewareName: 'Tomcat-01', type: 'Tomcat', category: '安全配置', severity: 'high', issueTitle: '禁用默认管理控制台', issueDescription: 'Tomcat管理控制台未禁用或未做访问限制', suggestion: '修改conf/tomcat-users.xml，删除或注释默认用户，配置IP白名单访问限制', status: 'pending', relatedCheck: '访问控制与权限检查' },
  { id: 'MW-SG-003', middlewareName: 'Nginx-01', type: 'Nginx', category: '性能安全', severity: 'medium', issueTitle: '调整worker_connections', issueDescription: '当前worker_connections设置为1024，建议根据业务需求适当调高', suggestion: '在nginx.conf中设置worker_connections 4096; 并优化相关连接参数', status: 'pending', relatedCheck: '连接与性能安全检查' },
  { id: 'MW-SG-004', middlewareName: 'Redis-01', type: 'Redis', category: '安全配置', severity: 'high', issueTitle: '启用密码认证', issueDescription: 'Redis服务未设置密码认证，存在未授权访问风险', suggestion: '在redis.conf中设置requirepass <strong_password>，重启redis服务', status: 'generated', relatedCheck: '访问控制与权限检查' },
  { id: 'MW-SG-005', middlewareName: 'Tomcat-01', type: 'Tomcat', category: '日志安全', severity: 'medium', issueTitle: '启用访问日志', issueDescription: 'Tomcat访问日志未启用，无法追踪访问记录', suggestion: '在server.xml中配置AccessLogValve，启用访问日志记录', status: 'pending', relatedCheck: '日志与监控配置检查' },
];

export function MwHardeningSuggestion() {
  const [data] = useState<SuggestionItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.middlewareName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.issueTitle.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    high: data.filter(d => d.severity === 'high').length,
    medium: data.filter(d => d.severity === 'medium').length,
    low: data.filter(d => d.severity === 'low').length,
    generated: data.filter(d => d.status === 'generated').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">高危</span>;
    if (severity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中危</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低危</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'generated') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已生成</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">待生成</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">中间件安全加固建议</h2>
        <p className="text-sm text-gray-400 mt-1">针对检查出的中间件不合规项，自动生成加固建议</p>
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
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已生成建议</p>
              <p className="text-xl font-semibold text-green-400">{stats.generated}</p>
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
              placeholder="搜索中间件名称或问题标题..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Shield className="w-4 h-4" />
              生成全部建议
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出建议
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">{item.middlewareName}</span>
                  <span className="text-xs text-gray-500">{item.type}</span>
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
                  <span>类别: {item.category}</span>
                  <span>关联检查: {item.relatedCheck}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}