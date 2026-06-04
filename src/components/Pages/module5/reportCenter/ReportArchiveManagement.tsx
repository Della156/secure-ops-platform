'use client';

import React, { useState } from 'react';
import {
  Archive, Search, Filter, Download, RefreshCw,
  Plus, Edit3, Trash2, Eye, ChevronRight,
  FolderOpen, FileText, Calendar, User, Tag
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  size: string;
  category: string;
}

const reports: Report[] = [
  { id: 'r1', name: '2026年6月安全态势分析报告', type: 'PDF', date: '2026-06-02', author: '张工', status: 'published', size: '2.3 MB', category: '态势分析' },
  { id: 'r2', name: 'Q2季度安全审计报告', type: 'PDF', date: '2026-06-01', author: '李工', status: 'published', size: '5.1 MB', category: '审计报告' },
  { id: 'r3', name: '漏洞扫描月度报告', type: 'PDF', date: '2026-05-31', author: '王工', status: 'published', size: '1.8 MB', category: '漏洞报告' },
  { id: 'r4', name: '攻击事件回溯报告', type: 'PDF', date: '2026-05-30', author: '张工', status: 'draft', size: '856 KB', category: '事件报告' },
  { id: 'r5', name: '安全策略合规检查报告', type: 'PDF', date: '2026-05-29', author: '赵工', status: 'published', size: '3.2 MB', category: '合规报告' },
  { id: 'r6', name: '威胁情报分析月报', type: 'PDF', date: '2026-05-28', author: '刘工', status: 'archived', size: '2.1 MB', category: '情报报告' },
];

function StatusBadge({ status }: { status: Report['status'] }) {
  const config = {
    published: { bg: 'bg-green-500/10', text: 'text-green-400', label: '已发布' },
    draft: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '草稿' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '已归档' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function ReportArchiveManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = reports.filter(report => {
    const matchSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: reports.length,
    published: reports.filter(r => r.status === 'published').length,
    draft: reports.filter(r => r.status === 'draft').length,
    archived: reports.filter(r => r.status === 'archived').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-blue-400" />
            报告归档管理
          </h2>
          <p className="text-sm text-gray-400 mt-1">管理和归档安全分析报告</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            新建报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '报告总数', value: stats.total, icon: <Archive className="w-4 h-4" />, color: 'blue' },
          { label: '已发布', value: stats.published, icon: <FileText className="w-4 h-4" />, color: 'green' },
          { label: '草稿', value: stats.draft, icon: <Edit3 className="w-4 h-4" />, color: 'yellow' },
          { label: '已归档', value: stats.archived, icon: <FolderOpen className="w-4 h-4" />, color: 'gray' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索报告..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-[#111625] rounded-lg p-4 hover:border-blue-500/30 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-medium text-white">{report.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {report.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {report.type}
                    </span>
                    <span>{report.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={report.status} />
                  <button className="p-2 hover:bg-[#20293F] rounded" title="预览">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-[#20293F] rounded" title="编辑">
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded" title="删除">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">报告分类</h3>
          <div className="space-y-2">
            {[
              { name: '态势分析', count: 12 },
              { name: '审计报告', count: 8 },
              { name: '漏洞报告', count: 15 },
              { name: '事件报告', count: 6 },
              { name: '合规报告', count: 4 },
              { name: '情报报告', count: 9 },
            ].map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{cat.name}</span>
                <span className="text-xs text-white">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">最近操作</h3>
          <div className="space-y-2">
            {[
              { action: '发布', name: '2026年6月安全态势分析报告', time: '10分钟前' },
              { action: '创建', name: '攻击事件回溯报告', time: '1小时前' },
              { action: '归档', name: '威胁情报分析月报', time: '2小时前' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded ${
                    item.action === '发布' ? 'bg-green-500/20 text-green-400' :
                    item.action === '创建' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {item.action}
                  </span>
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportArchiveManagement;