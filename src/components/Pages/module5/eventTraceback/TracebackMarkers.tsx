'use client';

import React, { useState } from 'react';
import {
  Flag, Plus, Edit3, Trash2, Search, Filter,
  MapPin, Clock, AlertTriangle, CheckCircle2,
  XCircle, ChevronRight, Target, Tag
} from 'lucide-react';

interface Marker {
  id: string;
  time: string;
  type: 'critical' | 'warning' | 'info' | 'action';
  title: string;
  description: string;
  location: string;
  status: 'active' | 'resolved';
}

const markers: Marker[] = [
  { id: 'm1', time: '14:32:15', type: 'critical', title: '异常流量检测', description: '检测到来自203.156.89.42的异常访问模式', location: '防火墙', status: 'resolved' },
  { id: 'm2', time: '14:32:30', type: 'warning', title: '告警规则触发', description: '连续10次登录失败，触发暴力破解检测规则', location: 'SIEM', status: 'resolved' },
  { id: 'm3', time: '14:33:00', type: 'action', title: '自动阻断执行', description: '防火墙自动阻断可疑IP地址', location: '防火墙', status: 'resolved' },
  { id: 'm4', time: '14:35:00', type: 'info', title: '工单创建', description: '安全工单已创建并分配给张工', location: '工单系统', status: 'active' },
  { id: 'm5', time: '14:40:00', type: 'info', title: '威胁情报匹配', description: '攻击IP匹配已知威胁情报', location: '威胁情报系统', status: 'active' },
];

function MarkerIcon({ type }: { type: Marker['type'] }) {
  const icons = {
    critical: <AlertTriangle className="w-4 h-4 text-red-400" />,
    warning: <XCircle className="w-4 h-4 text-yellow-400" />,
    info: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
    action: <Target className="w-4 h-4 text-green-400" />,
  };
  return icons[type];
}

function MarkerBadge({ type }: { type: Marker['type'] }) {
  const config = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: '关键节点' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '警告节点' },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '信息节点' },
    action: { bg: 'bg-green-500/10', text: 'text-green-400', label: '操作节点' },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: Marker['status'] }) {
  const config = {
    active: { bg: 'bg-green-500/10', text: 'text-green-400', label: '进行中' },
    resolved: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '已完成' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function TracebackMarkers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMarkers = markers.filter(marker => {
    const matchSearch = marker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || marker.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: markers.length,
    critical: markers.filter(m => m.type === 'critical').length,
    active: markers.filter(m => m.status === 'active').length,
    resolved: markers.filter(m => m.status === 'resolved').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-orange-400" />
            回溯关键点标记
          </h2>
          <p className="text-sm text-gray-400 mt-1">标记和管理事件回溯过程中的关键节点</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            添加标记
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '标记总数', value: stats.total, icon: <Flag className="w-4 h-4" />, color: 'blue' },
          { label: '关键节点', value: stats.critical, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '进行中', value: stats.active, icon: <Target className="w-4 h-4" />, color: 'green' },
          { label: '已完成', value: stats.resolved, icon: <CheckCircle2 className="w-4 h-4" />, color: 'gray' },
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
              placeholder="搜索标记..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="all">全部类型</option>
              <option value="critical">关键节点</option>
              <option value="warning">警告节点</option>
              <option value="info">信息节点</option>
              <option value="action">操作节点</option>
            </select>
          </div>
        </div>

        <div className="relative pl-6 border-l-2 border-[#2A354D]">
          {filteredMarkers.map((marker, i) => (
            <div key={marker.id} className="relative mb-4 last:mb-0">
              <div className={`absolute -left-[10px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                marker.type === 'critical' ? 'bg-red-500 border-red-500' :
                marker.type === 'warning' ? 'bg-yellow-500 border-yellow-500' :
                marker.type === 'info' ? 'bg-blue-500 border-blue-500' : 'bg-green-500 border-green-500'
              }`}>
                <MarkerIcon type={marker.type} />
              </div>
              <div className="bg-[#111625] rounded-lg p-4 ml-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-400">{marker.time}</span>
                      <MarkerBadge type={marker.type} />
                      <StatusBadge status={marker.status} />
                    </div>
                    <h3 className="text-sm font-medium text-white mt-1">{marker.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{marker.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {marker.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-[#20293F] rounded" title="编辑">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded" title="删除">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" />
            标记类型统计
          </h3>
          <div className="space-y-2">
            {[
              { type: '关键节点', count: 1, color: 'bg-red-500' },
              { type: '警告节点', count: 1, color: 'bg-yellow-500' },
              { type: '信息节点', count: 2, color: 'bg-blue-500' },
              { type: '操作节点', count: 1, color: 'bg-green-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-400">{item.type}</span>
                </div>
                <span className="text-xs text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            时间统计
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">首个标记</span>
              <span className="text-white">14:32:15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">最后标记</span>
              <span className="text-white">14:40:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">时间跨度</span>
              <span className="text-white">7分45秒</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">平均间隔</span>
              <span className="text-white">1分39秒</span>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">快速操作</h3>
          <div className="space-y-2">
            {[
              { label: '导出标记', icon: <ChevronRight className="w-3 h-3" /> },
              { label: '生成报告', icon: <ChevronRight className="w-3 h-3" /> },
              { label: '批量处理', icon: <ChevronRight className="w-3 h-3" /> },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#111625] rounded text-xs text-gray-400 hover:text-white">
                {item.label}
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TracebackMarkers;