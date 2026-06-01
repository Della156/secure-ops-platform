'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, XCircle, Wifi, WifiOff, Server, Activity, Clock } from 'lucide-react';

interface AccessStatus {
  id: string;
  taskName: string;
  accessPoint: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
  latency: number;
  protocol: string;
  dataFlow: number;
}

const mockData: AccessStatus[] = [
  { id: 'ACC-001', taskName: '防火墙配置同步', accessPoint: '192.168.1.1:22', status: 'connected', lastConnected: '2026-05-24 15:30:00', latency: 12, protocol: 'SSH', dataFlow: 156 },
  { id: 'ACC-002', taskName: 'IDS日志采集', accessPoint: 'https://ids.local/api', status: 'connected', lastConnected: '2026-05-24 15:29:00', latency: 45, protocol: 'REST', dataFlow: 892 },
  { id: 'ACC-003', taskName: '网络设备监控', accessPoint: '192.168.1.10:161', status: 'error', lastConnected: '2026-05-24 14:00:00', latency: -1, protocol: 'SNMP', dataFlow: 0 },
  { id: 'ACC-004', taskName: '数据库备份', accessPoint: 'db.local:3306', status: 'disconnected', lastConnected: '2026-05-23 16:45:00', latency: -1, protocol: 'SQL', dataFlow: 0 },
  { id: 'ACC-005', taskName: 'Web应用扫描', accessPoint: 'https://app.local/scanner', status: 'connected', lastConnected: '2026-05-24 15:28:00', latency: 78, protocol: 'REST', dataFlow: 423 },
  { id: 'ACC-006', taskName: '威胁情报同步', accessPoint: 'https://ti.company.com/v2', status: 'connected', lastConnected: '2026-05-24 15:25:00', latency: 156, protocol: 'REST', dataFlow: 1200 },
];

export function TaskAccessStatus() {
  const [data, setData] = useState<AccessStatus[]>(mockData);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setData(prev => prev.map(item => {
        if (item.status === 'connected') {
          const newLatency = Math.max(5, Math.min(200, item.latency + Math.floor(Math.random() * 10) - 5));
          const newDataFlow = item.dataFlow + Math.floor(Math.random() * 50);
          return { ...item, latency: newLatency, dataFlow: newDataFlow };
        }
        return item;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    const icons = {
      connected: <CheckCircle2 className="w-5 h-5 text-[#00C853]" />,
      disconnected: <XCircle className="w-5 h-5 text-[#6B7280]" />,
      error: <AlertCircle className="w-5 h-5 text-[#FF3B30]" />,
    };
    return icons[status as keyof typeof icons];
  };

  const getStatusText = (status: string) => {
    const texts = {
      connected: '已连接',
      disconnected: '已断开',
      error: '连接错误',
    };
    return texts[status as keyof typeof texts];
  };

  const getStatusBg = (status: string) => {
    const bgs = {
      connected: 'bg-[#00C853]/10',
      disconnected: 'bg-[#6B7280]/10',
      error: 'bg-[#FF3B30]/10',
    };
    return bgs[status as keyof typeof bgs];
  };

  const connectedCount = data.filter(item => item.status === 'connected').length;
  const disconnectedCount = data.filter(item => item.status === 'disconnected').length;
  const errorCount = data.filter(item => item.status === 'error').length;
  const avgLatency = data.filter(item => item.status === 'connected').reduce((sum, item) => sum + item.latency, 0) / connectedCount || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">任务接入状态管理</h1>
          <p className="text-[#9CA3AF]">实时监控自动化任务的接入连接状态</p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            autoRefresh ? 'bg-[#00C853] hover:bg-[#00A843] text-[#F3F4F6]' : 'bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB]'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          {autoRefresh ? '自动刷新中' : '开启自动刷新'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0066FF]/10 rounded-lg">
              <Server className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">接入总数</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">{data.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00C853]/10 rounded-lg">
              <Wifi className="w-5 h-5 text-[#00C853]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">已连接</p>
              <p className="text-2xl font-bold text-[#00C853]">{connectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF9100]/10 rounded-lg">
              <WifiOff className="w-5 h-5 text-[#FF9100]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">已断开</p>
              <p className="text-2xl font-bold text-[#FF9100]">{disconnectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF3B30]/10 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[#FF3B30]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">连接错误</p>
              <p className="text-2xl font-bold text-[#FF3B30]">{errorCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A354D]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#F3F4F6]">接入状态列表</h3>
            <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
              <Activity className="w-4 h-4" />
              <span>平均延迟: {avgLatency.toFixed(0)}ms</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-[#2A354D]">
          {data.map((item) => (
            <div key={item.id} className={`px-6 py-4 hover:bg-[#181F32]/30 transition-colors ${getStatusBg(item.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium text-[#F3F4F6]">{item.taskName}</span>
                  </div>
                  <span className="text-sm text-[#9CA3AF]">{item.accessPoint}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0066FF]/20 text-[#0066FF] border border-[#0066FF]/30">
                    {item.protocol}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  {item.status === 'connected' && (
                    <>
                      <div className="text-center">
                        <p className="text-xs text-[#9CA3AF]">延迟</p>
                        <p className={`text-sm font-medium ${item.latency > 100 ? 'text-[#FF9100]' : 'text-[#00C853]'}`}>
                          {item.latency}ms
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-[#9CA3AF]">流量</p>
                        <p className="text-sm font-medium text-[#F3F4F6]">{item.dataFlow} KB/s</p>
                      </div>
                    </>
                  )}
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      item.status === 'connected' ? 'text-[#00C853]' : 
                      item.status === 'error' ? 'text-[#FF3B30]' : 'text-[#6B7280]'
                    }`}>
                      {getStatusText(item.status)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <Clock className="w-3 h-3" />
                      <span>{item.lastConnected}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}