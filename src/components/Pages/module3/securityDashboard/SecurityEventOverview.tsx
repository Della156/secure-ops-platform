'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Shield, ArrowRight } from 'lucide-react';

const mockEvents = [
  { id: 'evt-001', type: '入侵检测', source: '192.168.1.100', target: 'Web服务器', time: '10:35:22', severity: 'high', status: 'active' },
  { id: 'evt-002', type: '恶意软件', source: '终端PC-001', target: '终端设备', time: '10:34:18', severity: 'high', status: 'active' },
  { id: 'evt-003', type: 'SQL注入', source: '外部IP', target: '数据库', time: '10:32:45', severity: 'medium', status: 'processing' },
  { id: 'evt-004', type: '异常流量', source: '防火墙', target: '网络边界', time: '10:30:12', severity: 'medium', status: 'resolved' },
  { id: 'evt-005', type: '弱口令攻击', source: 'VPN网关', target: '认证系统', time: '10:28:33', severity: 'low', status: 'resolved' },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '进行中';
    case 'processing': return '处理中';
    case 'resolved': return '已解决';
    default: return '未知';
  }
};

export function SecurityEventOverview() {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);

  const stats = {
    totalEvents: 156,
    todayEvents: 58,
    avgResponseTime: '2.3分钟',
    resolutionRate: '94%',
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全事件总览</h1>
          <p className="text-slate-400 mt-1">全面掌握安全事件情况，快速响应威胁</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">累计事件</span>
            <AlertTriangle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalEvents}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">今日事件</span>
            <Clock className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.todayEvents}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">平均响应</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mt-2">{stats.avgResponseTime}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">处置率</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-2">{stats.resolutionRate}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">事件类型</th>
                <th className="text-left px-4 py-2.5">来源</th>
                <th className="text-left px-4 py-2.5">目标</th>
                <th className="text-left px-4 py-2.5">时间</th>
                <th className="text-left px-4 py-2.5">严重程度</th>
                <th className="text-left px-4 py-2.5">状态</th>
              </tr>
            </thead>
            <tbody>
              {mockEvents.map(event => (
                <tr 
                  key={event.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedEvent.id === event.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <td className="px-4 py-3 text-white font-medium">{event.type}</td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{event.source}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{event.target}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{event.time}</td>
                  <td className="px-4 py-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      event.status === 'active' ? 'bg-red-500/20 text-red-400' :
                      event.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {getStatusText(event.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">事件详情</h3>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg ${
                  selectedEvent.severity === 'high' ? 'bg-red-500/20' :
                  selectedEvent.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                } flex items-center justify-center`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    selectedEvent.severity === 'high' ? 'text-red-400' :
                    selectedEvent.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedEvent.type}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    selectedEvent.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    selectedEvent.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedEvent.severity === 'high' ? '高危' : selectedEvent.severity === 'medium' ? '中危' : '低危'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">事件ID</p>
                  <p className="text-slate-300 font-mono">{selectedEvent.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">来源地址</p>
                  <p className="text-slate-300 font-mono">{selectedEvent.source}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">目标资产</p>
                  <p className="text-slate-300">{selectedEvent.target}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">发生时间</p>
                  <p className="text-slate-300 font-mono">{selectedEvent.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">当前状态</p>
                  <span className={`${
                    selectedEvent.status === 'active' ? 'text-red-400' :
                    selectedEvent.status === 'processing' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {getStatusText(selectedEvent.status)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  查看完整日志
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}