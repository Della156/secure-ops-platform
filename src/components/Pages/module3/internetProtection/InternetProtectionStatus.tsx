'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Pause, Play, Eye, Server } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockTasks = [
  { id: 'IPM-001', name: '边界防护监测任务', status: 'running', progress: 75, duration: '2小时30分', lastUpdate: '2分钟前' },
  { id: 'IPM-002', name: '外网威胁监测', status: 'running', progress: 45, duration: '1小时15分', lastUpdate: '5分钟前' },
  { id: 'IPM-003', name: 'DDoS攻击防护', status: 'completed', progress: 100, duration: '4小时', lastUpdate: '1小时前' },
  { id: 'IPM-004', name: '入侵检测监测', status: 'running', progress: 60, duration: '3小时', lastUpdate: '1分钟前' },
  { id: 'IPM-005', name: 'Web应用防护', status: 'failed', progress: 30, duration: '30分钟', lastUpdate: '30分钟前' },
  { id: 'IPM-006', name: '恶意软件拦截', status: 'running', progress: 85, duration: '5小时', lastUpdate: '刚刚' },
];

const mockDevices = [
  { name: '防火墙-FW01', status: 'normal', cpu: 65, memory: 72, lastSync: '2分钟前' },
  { name: 'WAF-WAF01', status: 'normal', cpu: 45, memory: 58, lastSync: '5分钟前' },
  { name: 'IPS-IPS01', status: 'warning', cpu: 88, memory: 78, lastSync: '1分钟前' },
  { name: '威胁情报引擎', status: 'normal', cpu: 30, memory: 45, lastSync: '3分钟前' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'running': return '运行中';
    case 'completed': return '已完成';
    case 'failed': return '失败';
    default: return status;
  }
};

const getDeviceStatusStyle = (status: string) => {
  switch (status) {
    case 'normal': return 'bg-green-500/20 text-green-400 border-green-500/40';
    case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'error': return 'bg-red-500/20 text-red-400 border-red-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getDeviceStatusText = (status: string) => {
  switch (status) {
    case 'normal': return '正常';
    case 'warning': return '警告';
    case 'error': return '错误';
    default: return status;
  }
};

const getActivityColor = (status: string) =>
  status === 'running' ? 'text-green-400 animate-pulse' :
  status === 'failed' ? 'text-red-400' : 'text-blue-400';

const getUsageColor = (usage: number) =>
  usage > 80 ? 'bg-red-500' : usage > 60 ? 'bg-yellow-500' : 'bg-green-500';

export function InternetProtectionStatus() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tasks, setTasks] = useState(mockTasks);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'running' && task.progress < 100) {
          const newProgress = Math.min(task.progress + Math.random() * 2, 100);
          return { ...task, progress: Math.round(newProgress) };
        }
        return task;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setTasks(mockTasks.map(task => ({ ...task, progress: task.status === 'running' ? Math.min(task.progress + Math.random() * 5, 100) : task.progress })));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">互联网防护监测任务状态监控</h1>
          <p className="text-slate-400 mt-1">实时监控监测任务状态与边界设备状态</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? '自动刷新中' : '开启自动刷新'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />手动刷新
          </Button>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">边界设备状态</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDevices.map((device) => (
              <div key={device.name} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Server className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="text-slate-50 font-medium">{device.name}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getDeviceStatusStyle(device.status)}`}>
                    {getDeviceStatusText(device.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400">CPU使用率</span>
                      <span className="text-slate-300">{device.cpu}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getUsageColor(device.cpu)}`} style={{ width: `${device.cpu}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400">内存使用率</span>
                      <span className="text-slate-300">{device.memory}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getUsageColor(device.memory)}`} style={{ width: `${device.memory}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-3">最后同步: {device.lastSync}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">监测任务状态</h3>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className={`bg-slate-800/50 rounded-lg p-4 ${task.status === 'failed' ? 'border-l-4 border-red-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className={`w-5 h-5 mr-3 ${getActivityColor(task.status)}`} />
                    <div>
                      <p className="text-slate-50 font-medium">{task.name}</p>
                      <p className="text-slate-500 text-sm">任务ID: {task.id} | 运行时长: {task.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    {task.status === 'running' && <Button variant="ghost" size="sm"><Pause className="w-4 h-4" /></Button>}
                    {task.status === 'failed' && <Button variant="ghost" size="sm" className="text-green-400"><Play className="w-4 h-4" /></Button>}
                  </div>
                </div>
                {task.status !== 'completed' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400">进度</span>
                      <span className="text-slate-300">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${task.status === 'failed' ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                )}
                <p className="text-slate-500 text-xs mt-2">最后更新: {task.lastUpdate}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default InternetProtectionStatus;
