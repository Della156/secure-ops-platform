'use client';

import React, { useState } from 'react';
import { Server, Database, MessageSquare, Cpu, HardDrive, MemoryStick, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  type: 'app' | 'database' | 'queue' | 'cache';
  status: 'running' | 'warning' | 'error' | 'stopped';
  cpu: number;
  memory: number;
  uptime: string;
  version: string;
}

export function ServiceStatusMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const mockServices: Service[] = [
    { id: 'SVC-001', name: '认证服务', type: 'app', status: 'running', cpu: 23, memory: 45, uptime: '15天 8小时', version: 'v2.1.0' },
    { id: 'SVC-002', name: 'API网关', type: 'app', status: 'running', cpu: 45, memory: 67, uptime: '12天 14小时', version: 'v3.0.1' },
    { id: 'SVC-003', name: '数据同步服务', type: 'app', status: 'warning', cpu: 78, memory: 82, uptime: '5天 3小时', version: 'v1.8.2' },
    { id: 'SVC-004', name: 'MySQL主库', type: 'database', status: 'running', cpu: 34, memory: 56, uptime: '30天 2小时', version: '8.0.33' },
    { id: 'SVC-005', name: 'Redis集群', type: 'cache', status: 'running', cpu: 12, memory: 78, uptime: '28天 6小时', version: '7.0.12' },
    { id: 'SVC-006', name: 'Kafka消息队列', type: 'queue', status: 'running', cpu: 28, memory: 42, uptime: '25天 10小时', version: '3.4.0' },
    { id: 'SVC-007', name: 'Elasticsearch', type: 'database', status: 'warning', cpu: 67, memory: 89, uptime: '18天 5小时', version: '8.11.0' },
    { id: 'SVC-008', name: '定时任务服务', type: 'app', status: 'running', cpu: 15, memory: 23, uptime: '10天 12小时', version: 'v2.0.0' },
  ];

  const stats = {
    total: mockServices.length,
    running: mockServices.filter(s => s.status === 'running').length,
    warning: mockServices.filter(s => s.status === 'warning').length,
    error: mockServices.filter(s => s.status === 'error').length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'app': return <Server className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'queue': return <MessageSquare className="w-4 h-4" />;
      case 'cache': return <MemoryStick className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'app': return '应用服务';
      case 'database': return '数据库';
      case 'queue': return '消息队列';
      case 'cache': return '缓存';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'stopped': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'running': return '运行中';
      case 'warning': return '警告';
      case 'error': return '错误';
      case 'stopped': return '已停止';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">核心应用服务进程状态监控</h2>
          <p className="text-sm text-gray-400 mt-1">实时监控核心服务进程状态，及时发现异常</p>
        </div>
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm ${autoRefresh ? 'bg-blue-600 text-white' : 'bg-[#20293F] text-gray-300'}`}
        >
          <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
          {autoRefresh ? '自动刷新中' : '手动刷新'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">服务总数</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">运行中</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.running}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">警告</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.warning}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">错误</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.error}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockServices.map((service) => (
          <div key={service.id} className={`bg-[#20293F] border rounded-lg p-4 ${
            service.status === 'warning' ? 'border-yellow-500/50' :
            service.status === 'error' ? 'border-red-500/50' :
            'border-[#2A354D]'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                  {getTypeIcon(service.type)}
                </div>
                <div>
                  <h3 className="font-medium text-white">{service.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{getTypeLabel(service.type)}</span>
                    <span>·</span>
                    <span>{service.version}</span>
                  </div>
                </div>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(service.status)}`}>
                {getStatusIcon(service.status)}
                {getStatusLabel(service.status)}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Cpu className="w-3 h-3" />
                  CPU
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${service.cpu > 70 ? 'bg-red-500' : service.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${service.cpu}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-10 text-right">{service.cpu}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MemoryStick className="w-3 h-3" />
                  内存
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-[#111625] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${service.memory > 80 ? 'bg-red-500' : service.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${service.memory}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-10 text-right">{service.memory}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <HardDrive className="w-3 h-3" />
                  运行时间
                </div>
                <span className="text-xs text-gray-300">{service.uptime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceStatusMonitor;