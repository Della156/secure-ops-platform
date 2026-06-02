'use client';

import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Clock, User, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface FaultItem {
  id: string;
  title: string;
  device: string;
  type: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'resolved';
  createTime: string;
  assignee: string;
}

const mockData: FaultItem[] = [
  { id: 'FLT-001', title: '数据库连接超时', device: 'prod-db', type: '数据库', level: 'critical', status: 'pending', createTime: '2026-06-02 10:30:00', assignee: 'admin' },
  { id: 'FLT-002', title: '防火墙策略异常', device: 'fw-01', type: '安全设备', level: 'high', status: 'processing', createTime: '2026-06-02 09:15:00', assignee: 'security' },
  { id: 'FLT-003', title: '日志服务中断', device: 'log-server', type: '服务', level: 'high', status: 'resolved', createTime: '2026-06-02 08:00:00', assignee: 'admin' },
  { id: 'FLT-004', title: '磁盘空间告警', device: 'app-01', type: '系统', level: 'medium', status: 'pending', createTime: '2026-06-02 11:00:00', assignee: 'ops' },
  { id: 'FLT-005', title: '网络延迟过高', device: 'network', type: '网络', level: 'low', status: 'processing', createTime: '2026-06-02 10:45:00', assignee: 'network' },
];

export function FaultHandleView() {
  const [data, setData] = useState<FaultItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredData = data.filter(item => {
    const matchSearch = !searchKeyword || item.title.toLowerCase().includes(searchKeyword.toLowerCase()) || item.device.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchLevel = levelFilter === 'all' || item.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const getLevelBadge = (level: string) => {
    if (level === 'critical') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
    if (level === 'high') return <span className="px-2 py-0.5 text-xs rounded-full bg-orange-500/20 text-orange-400">高</span>;
    if (level === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">低</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">待处理</span>;
    if (status === 'processing') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">处理中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已解决</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">故障处理</h2>
        <p className="text-sm text-gray-400 mt-1">故障工单管理、故障定位、故障处理流程管理</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索故障标题或设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部级别</option>
                <option value="critical">严重</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <AlertTriangle className="w-4 h-4" />
            创建工单
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${item.level === 'critical' ? 'text-red-400' : item.level === 'high' ? 'text-orange-400' : 'text-yellow-400'}`} />
                  <span className="text-white font-medium">{item.title}</span>
                  {getLevelBadge(item.level)}
                  {getStatusBadge(item.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>设备: {item.device}</span>
                  <span>类型: {item.type}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.createTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.assignee}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
                查看详情
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}