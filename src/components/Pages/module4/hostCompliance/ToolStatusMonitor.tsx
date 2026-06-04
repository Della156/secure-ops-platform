'use client';
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Server } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const initialStatus = [
  { id: 'host-001', name: 'web-server-01', tool: 'HIDS', status: 'online', cpu: 45, memory: 62, lastHeartbeat: '2026-06-03 08:05:32' },
  { id: 'host-002', name: 'db-server-01', tool: 'HIDS', status: 'online', cpu: 32, memory: 45, lastHeartbeat: '2026-06-03 08:05:28' },
  { id: 'host-003', name: 'api-gateway-01', tool: 'HIDS', status: 'warning', cpu: 88, memory: 78, lastHeartbeat: '2026-06-03 08:05:15' },
  { id: 'host-004', name: 'cdn-node-01', tool: 'HIDS', status: 'offline', cpu: 0, memory: 0, lastHeartbeat: '2026-06-03 07:58:45' },
  { id: 'host-005', name: 'backup-server-01', tool: 'HIDS', status: 'online', cpu: 15, memory: 30, lastHeartbeat: '2026-06-03 08:05:30' },
];

const statusConfig = {
  online: { label: '在线', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  warning: { label: '告警', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertTriangle },
  offline: { label: '离线', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

export function ToolStatusMonitor() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(prev => prev.map(item => ({
        ...item,
        cpu: Math.min(100, Math.max(0, item.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(0, item.memory + (Math.random() - 0.5) * 5)),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredStatus = status.filter(item => {
    if (search && !item.name.includes(search) && !item.id.includes(search)) return false;
    return true;
  });

  const stats = {
    total: status.length,
    online: status.filter(s => s.status === 'online').length,
    warning: status.filter(s => s.status === 'warning').length,
    offline: status.filter(s => s.status === 'offline').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="工具状态监测" description="实时监测主机安全工具的运行状态"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: handleRefresh, loading: isRefreshing },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">监控主机</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
            <span className="text-sm text-[#9CA3AF]">在线</span>
          </div>
          <div className="text-2xl font-semibold text-[#00D4AA]">{stats.online}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">告警</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{stats.warning}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">离线</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.offline}</div>
        </div>
      </div>

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              placeholder="搜索主机名称"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>实时更新中...</span>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredStatus.map(item => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-[#181F32]">
                <div className="flex items-center gap-4">
                  <Server className="w-8 h-8 text-[#0066FF]" />
                  <div>
                    <div className="font-medium text-[#F3F4F6]">{item.name}</div>
                    <div className="text-sm text-[#9CA3AF]">工具: {item.tool}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.color}`}>
                    <IconComponent icon={Icon} />
                    {config.label}
                  </span>
                </div>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-xs text-[#9CA3AF] mb-1">CPU</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#181F32] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.cpu > 80 ? 'bg-[#EF4444]' : item.cpu > 60 ? 'bg-[#F59E0B]' : 'bg-[#00D4AA]'}`}
                        style={{ width: `${item.cpu}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#F3F4F6]">{Math.round(item.cpu)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#9CA3AF] mb-1">内存</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#181F32] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.memory > 80 ? 'bg-[#EF4444]' : item.memory > 60 ? 'bg-[#F59E0B]' : 'bg-[#00D4AA]'}`}
                        style={{ width: `${item.memory}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#F3F4F6]">{Math.round(item.memory)}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#9CA3AF]">最后心跳</div>
                  <div className="text-sm text-[#F3F4F6] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.lastHeartbeat}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}