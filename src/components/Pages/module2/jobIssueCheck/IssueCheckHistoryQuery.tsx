'use client';

import React, { useState } from 'react';
import { Search, Filter, Calendar, Eye, Download, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

interface HistoryItem {
  id: string;
  taskName: string;
  target: string;
  taskType: string;
  status: 'success' | 'failed' | 'partial';
  issuesFound: number;
  startTime: string;
  endTime: string;
  duration: string;
  operator: string;
}

const mockHistoryData: HistoryItem[] = [
  { id: 'HIS-IC-001', taskName: '网络设备配置检查', target: 'core-switch-01', taskType: '配置检查', status: 'success', issuesFound: 0, startTime: '2026-06-02 08:00:00', endTime: '2026-06-02 08:15:00', duration: '15分钟', operator: 'admin' },
  { id: 'HIS-IC-002', taskName: '数据库安全基线检查', target: 'prod-db-01', taskType: '安全检查', status: 'partial', issuesFound: 2, startTime: '2026-06-02 07:30:00', endTime: '2026-06-02 07:50:00', duration: '20分钟', operator: 'admin' },
  { id: 'HIS-IC-003', taskName: 'Web服务器性能检查', target: 'web-server-01', taskType: '性能检查', status: 'failed', issuesFound: 0, startTime: '2026-06-02 07:00:00', endTime: '2026-06-02 07:05:00', duration: '5分钟', operator: 'ops' },
  { id: 'HIS-IC-004', taskName: '防火墙规则检查', target: 'fw-01', taskType: '规则检查', status: 'success', issuesFound: 5, startTime: '2026-06-01 20:00:00', endTime: '2026-06-01 20:25:00', duration: '25分钟', operator: 'admin' },
  { id: 'HIS-IC-005', taskName: '应用部署一致性检查', target: 'app-cluster', taskType: '部署检查', status: 'success', issuesFound: 1, startTime: '2026-06-01 18:00:00', endTime: '2026-06-01 18:30:00', duration: '30分钟', operator: 'ops' },
  { id: 'HIS-IC-006', taskName: '中间件配置检查', target: 'middleware-01', taskType: '配置检查', status: 'success', issuesFound: 0, startTime: '2026-06-01 16:00:00', endTime: '2026-06-01 16:20:00', duration: '20分钟', operator: 'admin' },
];

export function IssueCheckHistoryQuery() {
  const [data] = useState<HistoryItem[]>(mockHistoryData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.taskName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.target.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string, issuesFound: number) => {
    if (status === 'success' && issuesFound === 0) return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />成功</span>;
    if (status === 'success' && issuesFound > 0) return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />完成(有问题)</span>;
    if (status === 'partial') return <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />部分完成</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" />失败</span>;
  };

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    partial: data.filter(d => d.status === 'partial').length,
    failed: data.filter(d => d.status === 'failed').length,
    totalIssues: data.reduce((sum, d) => sum + d.issuesFound, 0),
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业问题检查任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史记录查询、详情查看</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">成功</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-gray-400 text-xs">部分完成</p>
              <p className="text-xl font-semibold text-orange-400">{stats.partial}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">发现问题</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.totalIssues}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务名称、目标或操作人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
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
                <option value="success">成功</option>
                <option value="partial">部分完成</option>
                <option value="failed">失败</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出记录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A354D]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">任务名称</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">发现问题</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">开始时间</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-[#2A354D] hover:bg-[#2A354D]/50 cursor-pointer transition-colors ${selectedItem?.id === item.id ? 'bg-[#2A354D]/50' : ''}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white font-medium">{item.taskName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{item.target}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.taskType}</span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(item.status, item.issuesFound)}</td>
                      <td className="px-4 py-3">
                        {item.issuesFound > 0 ? (
                          <span className="text-sm text-yellow-400 font-medium">{item.issuesFound} 个</span>
                        ) : (
                          <span className="text-sm text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">{item.operator}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{item.startTime}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无记录</p>}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
              <div className="p-4 border-b border-[#2A354D] flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">任务详情</h3>
                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white text-xs">关闭</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">任务ID</p>
                  <p className="text-sm text-white">{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">任务名称</p>
                  <p className="text-sm text-white">{selectedItem.taskName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">目标</p>
                  <p className="text-sm text-white">{selectedItem.target}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">任务类型</p>
                  <p className="text-sm text-white">{selectedItem.taskType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">状态</p>
                  <div>{getStatusBadge(selectedItem.status, selectedItem.issuesFound)}</div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">发现问题</p>
                  <p className="text-sm text-white">{selectedItem.issuesFound} 个</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">操作人</p>
                  <p className="text-sm text-white">{selectedItem.operator}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">开始时间</p>
                  <p className="text-sm text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedItem.startTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">结束时间</p>
                  <p className="text-sm text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedItem.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">耗时</p>
                  <p className="text-sm text-gray-300">{selectedItem.duration}</p>
                </div>
                <div className="pt-4 border-t border-[#2A354D] flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    下载报告
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
              <FileText className="w-12 h-12 mb-4 opacity-50" />
              <p>选择任务查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
