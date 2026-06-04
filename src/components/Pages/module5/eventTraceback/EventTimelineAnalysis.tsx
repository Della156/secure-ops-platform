'use client';

import React, { useState } from 'react';
import {
  Clock, Search, Filter, Download, RefreshCw,
  AlertTriangle, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, Calendar, MapPin, User
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  type: 'alert' | 'action' | 'info' | 'warning';
  source: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  { id: 'e1', time: '14:32:15', title: '检测到异常流量', type: 'alert', source: '安全监控系统', description: '来自IP 203.156.89.42的大量访问请求' },
  { id: 'e2', time: '14:32:30', title: '触发告警规则', type: 'action', source: 'SIEM系统', description: '触发暴力破解检测规则' },
  { id: 'e3', time: '14:33:00', title: '自动阻断IP', type: 'action', source: '防火墙', description: '自动阻断可疑IP地址' },
  { id: 'e4', time: '14:33:15', title: '通知安全团队', type: 'info', source: '通知系统', description: '发送告警通知至安全团队' },
  { id: 'e5', time: '14:35:00', title: '安全人员响应', type: 'info', source: '工单系统', description: '工单已分配给张工' },
  { id: 'e6', time: '14:40:00', title: '安全评估完成', type: 'warning', source: '安全分析', description: '确认攻击来自已知威胁源' },
  { id: 'e7', time: '15:00:00', title: '事件闭环', type: 'action', source: '安全运营', description: '事件已处理完成，归档记录' },
];

function EventIcon({ type }: { type: TimelineEvent['type'] }) {
  const icons = {
    alert: <AlertTriangle className="w-4 h-4 text-red-400" />,
    action: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
    info: <AlertCircle className="w-4 h-4 text-green-400" />,
    warning: <XCircle className="w-4 h-4 text-yellow-400" />,
  };
  return icons[type];
}

function EventBadge({ type }: { type: TimelineEvent['type'] }) {
  const config = {
    alert: { bg: 'bg-red-500/10', text: 'text-red-400', label: '告警' },
    action: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '操作' },
    info: { bg: 'bg-green-500/10', text: 'text-green-400', label: '信息' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '警告' },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function EventTimelineAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredEvents = timelineEvents.filter(event => {
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || event.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total: timelineEvents.length,
    alerts: timelineEvents.filter(e => e.type === 'alert').length,
    actions: timelineEvents.filter(e => e.type === 'action').length,
    duration: '28分钟',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            事件时间轴全景分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">查看事件完整时间线，追踪事件发展过程</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '事件总数', value: stats.total, icon: <Clock className="w-4 h-4" />, color: 'blue' },
          { label: '告警数', value: stats.alerts, icon: <AlertTriangle className="w-4 h-4" />, color: 'red' },
          { label: '操作数', value: stats.actions, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
          { label: '持续时间', value: stats.duration, icon: <Calendar className="w-4 h-4" />, color: 'purple' },
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
              placeholder="搜索事件..."
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
              <option value="alert">告警</option>
              <option value="action">操作</option>
              <option value="info">信息</option>
              <option value="warning">警告</option>
            </select>
          </div>
        </div>

        <div className="relative pl-6 border-l-2 border-[#2A354D]">
          {filteredEvents.map((event, i) => (
            <div key={event.id} className="relative mb-6 last:mb-0">
              <div className={`absolute -left-[9px] w-4 h-4 rounded-full border-2 ${
                event.type === 'alert' ? 'bg-red-500 border-red-500' :
                event.type === 'action' ? 'bg-blue-500 border-blue-500' :
                event.type === 'info' ? 'bg-green-500 border-green-500' : 'bg-yellow-500 border-yellow-500'
              }`} />
              <div className="bg-[#111625] rounded-lg p-4 ml-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-gray-400">{event.time}</span>
                      <EventBadge type={event.type} />
                    </div>
                    <h3 className="text-sm font-medium text-white mt-1">{event.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#20293F] flex items-center justify-center">
                    <EventIcon type={event.type} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">事件摘要</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">事件ID</span>
              <span className="text-white">EVT-2026-0602-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">开始时间</span>
              <span className="text-white">2026-06-02 14:32:15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">结束时间</span>
              <span className="text-white">2026-06-02 15:00:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">处理人员</span>
              <span className="text-white flex items-center gap-1">
                <User className="w-3 h-3" />
                张工
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">事件标签</h3>
          <div className="flex flex-wrap gap-2">
            {['暴力破解', '自动化响应', '高危', '外部攻击', '已闭环'].map((tag, i) => (
              <span key={i} className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3">相关资源</h3>
          <div className="space-y-2">
            {[
              { name: '攻击IP分析报告', type: '报告' },
              { name: '防火墙日志', type: '日志' },
              { name: '威胁情报匹配', type: '情报' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{item.name}</span>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  查看 <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTimelineAnalysis;