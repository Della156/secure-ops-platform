'use client';

import { useState } from 'react';
import { AlertTriangle, Shield, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const mockEvents = [
  { id: 'SE-001', time: '10:30:25', type: 'threat', title: '检测到恶意流量', description: '从IP 192.168.1.100发起的异常访问', status: 'active' },
  { id: 'SE-002', time: '10:28:12', type: 'alert', title: '高优先级告警触发', description: 'Web应用防火墙拦截SQL注入攻击', status: 'resolved' },
  { id: 'SE-003', time: '10:25:08', type: 'action', title: '自动阻断执行', description: '阻断IP地址 10.0.0.5 的访问', status: 'completed' },
  { id: 'SE-004', time: '10:22:45', type: 'threat', title: '漏洞扫描检测', description: '发现CVE-2024-3094相关攻击尝试', status: 'active' },
  { id: 'SE-005', time: '10:18:33', type: 'alert', title: '资产异常告警', description: '终端设备出现异常进程', status: 'investigating' },
  { id: 'SE-006', time: '10:15:00', type: 'action', title: '隔离主机执行', description: '隔离受感染终端主机', status: 'completed' },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'threat': return <AlertTriangle className="w-4 h-4" />;
    case 'alert': return <Shield className="w-4 h-4" />;
    case 'action': return <CheckCircle2 className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'threat': return 'text-red-400 bg-red-500/20';
    case 'alert': return 'text-yellow-400 bg-yellow-500/20';
    case 'action': return 'text-green-400 bg-green-500/20';
    default: return 'text-slate-400 bg-slate-500/20';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-red-500';
    case 'investigating': return 'bg-yellow-500';
    case 'resolved': return 'bg-blue-500';
    case 'completed': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export function SecurityEventTimeline() {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全事件时间线</h1>
          <p className="text-slate-400 mt-1">按时间顺序展示安全事件，追踪安全态势变化</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="relative">
              <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-[#2A354D]" />
              <div className="space-y-4">
                {mockEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className={`relative flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedEvent.id === event.id 
                        ? 'bg-blue-500/20 ring-1 ring-blue-500/40' 
                        : 'hover:bg-[#111625]/50'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`relative z-10 w-11 h-11 rounded-lg ${getTypeColor(event.type)} flex items-center justify-center`}>
                      {getTypeIcon(event.type)}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono">{event.time}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeColor(event.type)}`}>
                          {event.type === 'threat' ? '威胁' : event.type === 'alert' ? '告警' : '动作'}
                        </span>
                      </div>
                      <p className="text-white font-medium mt-1">{event.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{event.description}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)} mt-3`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">事件详情</h3>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#111625] rounded-lg">
                <div className={`w-10 h-10 rounded-lg ${getTypeColor(selectedEvent.type)} flex items-center justify-center`}>
                  {getTypeIcon(selectedEvent.type)}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedEvent.title}</p>
                  <p className="text-slate-500 text-xs">{selectedEvent.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">事件时间</p>
                  <p className="text-slate-300 font-mono">{selectedEvent.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">事件类型</p>
                  <span className={`text-sm ${getTypeColor(selectedEvent.type)} px-2 py-1 rounded`}>
                    {selectedEvent.type === 'threat' ? '威胁事件' : selectedEvent.type === 'alert' ? '告警事件' : '处置动作'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前状态</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedEvent.status)}`} />
                    <span className="text-slate-300">
                      {selectedEvent.status === 'active' ? '进行中' : 
                       selectedEvent.status === 'investigating' ? '调查中' : 
                       selectedEvent.status === 'resolved' ? '已解决' : '已完成'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">事件描述</p>
                  <p className="text-slate-300 text-sm">{selectedEvent.description}</p>
                </div>
              </div>
              <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                查看完整日志
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}