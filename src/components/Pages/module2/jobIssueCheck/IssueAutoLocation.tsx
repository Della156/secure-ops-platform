'use client';

import React, { useState } from 'react';
import { AlertTriangle, MapPin, CheckCircle, Search, Filter, Tag, Eye, XCircle } from 'lucide-react';

interface IssueItem {
  id: string;
  taskId: string;
  issueType: string;
  location: string;
  description: string;
  status: 'pending' | 'analyzed' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  foundTime: string;
  tags: string[];
}

const mockIssues: IssueItem[] = [
  { id: 'ISS-001', taskId: 'IC-002', issueType: '性能问题', location: '/usr/local/app/config.yaml', description: '数据库连接池配置过小，导致请求超时', status: 'pending', severity: 'high', foundTime: '2026-06-02 09:05:00', tags: ['性能', '配置'] },
  { id: 'ISS-002', taskId: 'IC-002', issueType: '配置问题', location: '/etc/nginx/nginx.conf', description: 'Nginx worker进程数配置不合理', status: 'analyzed', severity: 'medium', foundTime: '2026-06-02 09:10:00', tags: ['配置', 'Nginx'] },
  { id: 'ISS-003', taskId: 'IC-004', issueType: '安全问题', location: 'firewall-rule-1024', description: '存在开放端口范围过大的规则', status: 'pending', severity: 'critical', foundTime: '2026-06-02 07:15:00', tags: ['安全', '防火墙'] },
  { id: 'ISS-004', taskId: 'IC-004', issueType: '规则冲突', location: 'firewall-policy-group-3', description: '存在规则冲突，可能导致流量被错误拦截', status: 'resolved', severity: 'high', foundTime: '2026-06-02 07:20:00', tags: ['防火墙', '规则'] },
  { id: 'ISS-005', taskId: 'IC-004', issueType: '冗余规则', location: 'firewall-rule-512', description: '该规则已被其他规则覆盖，属于冗余规则', status: 'analyzed', severity: 'low', foundTime: '2026-06-02 07:22:00', tags: ['防火墙', '优化'] },
];

export function IssueAutoLocation() {
  const [data] = useState<IssueItem[]>(mockIssues);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.issueType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />已解决</span>;
    if (status === 'analyzed') return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1"><Search className="w-3 h-3" />已分析</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />待处理</span>;
  };

  const stats = {
    total: data.length,
    pending: data.filter(d => d.status === 'pending').length,
    analyzed: data.filter(d => d.status === 'analyzed').length,
    resolved: data.filter(d => d.status === 'resolved').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业问题自动定位标注</h2>
        <p className="text-sm text-gray-400 mt-1">问题识别、问题定位、问题标注</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">问题总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待处理</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">已分析</p>
              <p className="text-xl font-semibold text-blue-400">{stats.analyzed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已解决</p>
              <p className="text-xl font-semibold text-green-400">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索问题..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="all">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="analyzed">已分析</option>
                    <option value="resolved">已解决</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedIssue(item)}
                className={`bg-[#1E2736] border rounded-lg p-4 cursor-pointer transition-all ${selectedIssue?.id === item.id ? 'border-blue-500/50 ring-1 ring-blue-500/30' : 'border-[#2A354D] hover:border-[#2A354D]/70'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{item.issueType}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getSeverityColor(item.severity)}`}>
                          {item.severity === 'critical' ? '严重' : item.severity === 'high' ? '高' : item.severity === 'medium' ? '中' : '低'}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{item.description}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>位置: {item.location}</span>
                        <span>•</span>
                        <span>发现于: {item.foundTime}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-600/30 text-gray-300">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedIssue ? (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
              <div className="p-4 border-b border-[#2A354D] flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">问题详情</h3>
                <button onClick={() => setSelectedIssue(null)} className="text-gray-400 hover:text-white text-xs">关闭</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题ID</p>
                  <p className="text-sm text-white">{selectedIssue.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题类型</p>
                  <p className="text-sm text-white">{selectedIssue.issueType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">严重程度</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getSeverityColor(selectedIssue.severity)}`}>
                    {selectedIssue.severity === 'critical' ? '严重' : selectedIssue.severity === 'high' ? '高' : selectedIssue.severity === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题定位</p>
                  <div className="bg-[#111827] border border-[#2A354D] rounded-lg p-3">
                    <p className="text-sm text-gray-300 font-mono">{selectedIssue.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">问题描述</p>
                  <p className="text-sm text-gray-300">{selectedIssue.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">关联任务</p>
                  <p className="text-sm text-blue-400">{selectedIssue.taskId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">发现时间</p>
                  <p className="text-sm text-gray-300">{selectedIssue.foundTime}</p>
                </div>
                <div className="pt-4 border-t border-[#2A354D] flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    标注问题
                  </button>
                  <button className="flex-1 px-3 py-2 bg-[#2A354D] hover:bg-[#2A354D]/70 text-gray-300 rounded-lg text-sm transition-colors">
                    添加备注
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
              <p>选择问题查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
