'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, XCircle, Clock, MapPin, Server } from 'lucide-react';

const mockAlerts = [
  { id: 'ALT-001', type: '入侵检测', severity: 'high', source: '192.168.1.100', target: 'Web服务器', time: '2024-01-15 10:35:22', status: 'active' },
  { id: 'ALT-002', type: '恶意软件', severity: 'high', source: '终端PC-001', target: '终端设备', time: '2024-01-15 10:34:18', status: 'active' },
  { id: 'ALT-003', type: 'SQL注入', severity: 'medium', source: '外部IP', target: '数据库', time: '2024-01-15 10:32:45', status: 'processing' },
  { id: 'ALT-004', type: '异常流量', severity: 'medium', source: '防火墙', target: '网络边界', time: '2024-01-15 10:30:12', status: 'resolved' },
  { id: 'ALT-005', type: '弱口令攻击', severity: 'low', source: 'VPN网关', target: '认证系统', time: '2024-01-15 10:28:33', status: 'resolved' },
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
    case 'active': return '活跃';
    case 'processing': return '处理中';
    case 'resolved': return '已解决';
    default: return '未知';
  }
};

export function RealTimeAlertMonitor() {
  const [selectedAlert, setSelectedAlert] = useState(mockAlerts[0]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    total: mockAlerts.length,
    active: mockAlerts.filter(a => a.status === 'active').length,
    processing: mockAlerts.filter(a => a.status === 'processing').length,
    resolved: mockAlerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">实时告警监控</h1>
          <p className="text-slate-400 mt-1">实时监控安全告警，及时响应安全事件</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#20293F] rounded-lg">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-white font-mono">{time.toLocaleString('zh-CN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">告警总数</span>
            <AlertTriangle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">活跃告警</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{stats.active}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">处理中</span>
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">{stats.processing}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">已解决</span>
            <XCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{stats.resolved}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#111625] text-slate-400 text-xs">
              <tr>
                <th className="text-left px-4 py-2.5">严重程度</th>
                <th className="text-left px-4 py-2.5">告警类型</th>
                <th className="text-left px-4 py-2.5">来源</th>
                <th className="text-left px-4 py-2.5">目标</th>
                <th className="text-left px-4 py-2.5">时间</th>
                <th className="text-left px-4 py-2.5">状态</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map(alert => (
                <tr 
                  key={alert.id}
                  className={`border-t border-[#2A354D] hover:bg-[#111625]/50 cursor-pointer transition-all ${
                    selectedAlert.id === alert.id ? 'bg-blue-500/10' : ''
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <td className="px-4 py-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{alert.type}</td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{alert.source}
                  </td>
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1">
                    <Server className="w-3 h-3" />{alert.target}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{alert.time.split(' ')[1]}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      alert.status === 'active' ? 'bg-red-500/20 text-red-400' :
                      alert.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {getStatusText(alert.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">告警详情</h3>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg ${
                  selectedAlert.severity === 'high' ? 'bg-red-500/20' :
                  selectedAlert.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                } flex items-center justify-center`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    selectedAlert.severity === 'high' ? 'text-red-400' :
                    selectedAlert.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedAlert.type}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    selectedAlert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    selectedAlert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedAlert.severity === 'high' ? '高危' : selectedAlert.severity === 'medium' ? '中危' : '低危'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">告警ID</span>
                  <span className="text-slate-300">{selectedAlert.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">来源地址</span>
                  <span className="text-slate-300 font-mono">{selectedAlert.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">目标资产</span>
                  <span className="text-slate-300">{selectedAlert.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">发生时间</span>
                  <span className="text-slate-300 font-mono">{selectedAlert.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-sm">当前状态</span>
                  <span className={`${
                    selectedAlert.status === 'active' ? 'text-red-400' :
                    selectedAlert.status === 'processing' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {getStatusText(selectedAlert.status)}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#2A354D] space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
                  查看详情
                </button>
                {selectedAlert.status !== 'resolved' && (
                  <button className="w-full px-3 py-2 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
                    标记为已处理
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}