'use client';

import { useState, useEffect } from 'react';
import { Activity, Server, Database, Network, Cpu, HardDrive, Wifi, Clock } from 'lucide-react';

const mockServices = [
  { name: 'API服务', status: 'running', cpu: 45, memory: 62 },
  { name: '数据库服务', status: 'running', cpu: 23, memory: 78 },
  { name: '消息队列', status: 'running', cpu: 12, memory: 35 },
  { name: '定时任务', status: 'running', cpu: 8, memory: 22 },
  { name: '缓存服务', status: 'warning', cpu: 85, memory: 92 },
];

export function SystemMonitorView() {
  const [time, setTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [diskUsage, setDiskUsage] = useState(75);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setCpuUsage(Math.floor(Math.random() * 30) + 30);
      setMemoryUsage(Math.floor(Math.random() * 20) + 50);
      setDiskUsage(Math.floor(Math.random() * 10) + 70);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">系统监控视图</h1>
          <p className="text-slate-400 mt-1">实时监控系统运行状态</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#20293F] rounded-lg">
          <Clock className="w-4 h-4 text-green-400" />
          <span className="text-white font-mono">{time.toLocaleTimeString('zh-CN')}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">CPU使用率</span>
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{cpuUsage}%</div>
          <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-500" style={{ width: `${cpuUsage}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">内存使用率</span>
            <HardDrive className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{memoryUsage}%</div>
          <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-green-500" style={{ width: `${memoryUsage}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">磁盘使用率</span>
            <HardDrive className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{diskUsage}%</div>
          <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-purple-500" style={{ width: `${diskUsage}%` }} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">网络状态</span>
            <Wifi className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mt-2">正常</div>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">网络连接正常</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">服务状态</h3>
          <div className="space-y-3">
            {mockServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)} ${service.status === 'running' ? 'animate-pulse' : ''}`} />
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">CPU</p>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-[#20293F] rounded-full overflow-hidden">
                        <div className={`h-full ${service.cpu > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${service.cpu}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{service.cpu}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">内存</p>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-[#20293F] rounded-full overflow-hidden">
                        <div className={`h-full ${service.memory > 90 ? 'bg-red-500' : service.memory > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${service.memory}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{service.memory}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-4">系统资源趋势</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="flex gap-0.5 w-full">
                  <div 
                    className="flex-1 bg-blue-500 rounded-t-sm"
                    style={{ height: `${30 + Math.random() * 40}px` }}
                  />
                  <div 
                    className="flex-1 bg-green-500 rounded-t-sm"
                    style={{ height: `${20 + Math.random() * 50}px` }}
                  />
                </div>
                <span className="text-xs text-slate-500 mt-1">
                  {['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-xs text-slate-400">CPU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-xs text-slate-400">内存</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}