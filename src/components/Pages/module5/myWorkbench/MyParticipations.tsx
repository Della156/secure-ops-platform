'use client';

import React, { useState } from 'react';
import {
  Users, Search, Filter, Calendar, Clock,
  ChevronRight, MoreVertical, MessageSquare,
  FileText, ArrowRight, CheckCircle2
} from 'lucide-react';

interface Participation {
  id: string;
  projectName: string;
  role: string;
  status: 'active' | 'completed' | 'pending';
  progress: number;
  lastActivity: string;
  members: number;
  dueDate: string;
}

const participations: Participation[] = [
  { id: 'p1', projectName: '安全运维平台升级', role: '技术负责人', status: 'active', progress: 65, lastActivity: '30分钟前', members: 8, dueDate: '2026-06-30' },
  { id: 'p2', projectName: '威胁情报系统建设', role: '安全分析师', status: 'active', progress: 40, lastActivity: '2小时前', members: 5, dueDate: '2026-07-15' },
  { id: 'p3', projectName: '漏洞扫描工具集成', role: '开发人员', status: 'completed', progress: 100, lastActivity: '3天前', members: 3, dueDate: '2026-05-20' },
  { id: 'p4', projectName: '安全合规检查', role: '审核员', status: 'pending', progress: 10, lastActivity: '1周前', members: 4, dueDate: '2026-08-01' },
];

function StatusBadge({ status }: { status: Participation['status'] }) {
  const config = {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', label: '进行中' },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '已完成' },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '待开始' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function MyParticipations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredParticipations = participations.filter(p => {
    const matchSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: participations.length,
    active: participations.filter(p => p.status === 'active').length,
    completed: participations.filter(p => p.status === 'completed').length,
    pending: participations.filter(p => p.status === 'pending').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            我的参与
          </h2>
          <p className="text-sm text-gray-400 mt-1">查看和管理您参与的项目和任务</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            查看全部
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '参与项目', value: stats.total, icon: <Users className="w-4 h-4" />, color: 'blue' },
          { label: '进行中', value: stats.active, icon: <Clock className="w-4 h-4" />, color: 'green' },
          { label: '已完成', value: stats.completed, icon: <CheckCircle2 className="w-4 h-4" />, color: 'purple' },
          { label: '待开始', value: stats.pending, icon: <Calendar className="w-4 h-4" />, color: 'orange' },
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

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索项目名称或角色..."
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
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
                <option value="pending">待开始</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredParticipations.map((participation) => (
            <div key={participation.id} className="p-4 hover:bg-[#111625] cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{participation.projectName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">角色: {participation.role}</span>
                      <StatusBadge status={participation.status} />
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">进度</span>
                        <span className="text-white">{participation.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            participation.status === 'completed' ? 'bg-green-500' :
                            participation.progress >= 50 ? 'bg-blue-500' :
                            participation.progress >= 25 ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${participation.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="p-1 hover:bg-[#20293F] rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">截止日期</div>
                    <div className="text-sm text-white">{participation.dueDate}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A354D]">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {participation.members} 位成员
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {participation.lastActivity}
                  </span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                  查看详情 <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredParticipations.length} 个项目</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyParticipations;