'use client';

import React, { useState } from 'react';
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, Key, Shield, Activity } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'testing';
  lastTest: string;
  responseTime: number;
}

interface Credential {
  id: string;
  name: string;
  type: 'SSH' | 'API' | 'SNMP';
  username: string;
  validUntil: string;
}

const mockDevices: Device[] = [
  { id: 'DEV-001', name: '主防火墙-FW-01', ip: '192.168.1.1', status: 'online', lastTest: '2026-06-01 10:30:00', responseTime: 45 },
  { id: 'DEV-002', name: '入侵检测系统-IDS-01', ip: '192.168.1.2', status: 'online', lastTest: '2026-06-01 10:28:00', responseTime: 32 },
  { id: 'DEV-003', name: 'Web应用防火墙-WAF-01', ip: '192.168.1.3', status: 'offline', lastTest: '2026-06-01 09:15:00', responseTime: 0 },
  { id: 'DEV-004', name: '终端安全管理-EDR-01', ip: '192.168.1.4', status: 'online', lastTest: '2026-06-01 10:25:00', responseTime: 67 },
];

const mockCredentials: Credential[] = [
  { id: 'cred-1', name: '防火墙SSH密钥', type: 'SSH', username: 'admin', validUntil: '2026-12-31' },
  { id: 'cred-2', name: 'IDS API凭证', type: 'API', username: 'api_user', validUntil: '2026-09-15' },
];

export function DeviceConnectTest() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [testingDevice, setTestingDevice] = useState<string | null>(null);

  const handleTestConnection = (deviceId: string) => {
    setTestingDevice(deviceId);
    setDevices(devices.map(d => d.id === deviceId ? { ...d, status: 'testing' } : d));
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setDevices(devices.map(d => {
        if (d.id === deviceId) {
          return {
            ...d,
            status: success ? 'online' : 'offline',
            lastTest: new Date().toLocaleString('zh-CN'),
            responseTime: success ? Math.floor(Math.random() * 100) + 20 : 0,
          };
        }
        return d;
      }));
      setTestingDevice(null);
    }, 2000);
  };

  const handleTestAll = () => {
    devices.forEach(device => {
      handleTestConnection(device.id);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
      testing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    const labels = {
      online: '在线',
      offline: '离线',
      testing: '测试中',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getCredentialTypeBadge = (type: string) => {
    const styles = {
      SSH: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      API: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      SNMP: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    avgResponse: devices.filter(d => d.responseTime > 0).length > 0
      ? Math.round(devices.filter(d => d.responseTime > 0).reduce((sum, d) => sum + d.responseTime, 0) / devices.filter(d => d.responseTime > 0).length)
      : 0,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">设备连接与认证测试</h1>
        <p className="text-slate-400">测试设备连接状态，管理认证凭据</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">设备总数</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">在线设备</p>
              <p className="text-2xl font-bold text-white">{stats.online}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">离线设备</p>
              <p className="text-2xl font-bold text-white">{stats.offline}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">平均响应</p>
              <p className="text-2xl font-bold text-white">{stats.avgResponse}ms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h3 className="text-white font-semibold">连通性监测</h3>
          <button
            onClick={handleTestAll}
            disabled={testingDevice !== null}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${testingDevice !== null ? 'animate-spin' : ''}`} />
            全部测试
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">设备名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">响应时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">最后测试</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {devices.map(device => (
              <tr key={device.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    {getStatusBadge(device.status)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{device.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{device.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {device.responseTime > 0 ? `${device.responseTime}ms` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{device.lastTest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleTestConnection(device.id)}
                    disabled={testingDevice === device.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    测试连接
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-semibold">凭据管理</h3>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">凭据名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">用户名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">有效期至</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {credentials.map(cred => (
              <tr key={cred.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{cred.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getCredentialTypeBadge(cred.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{cred.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{cred.validUntil}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    有效
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
