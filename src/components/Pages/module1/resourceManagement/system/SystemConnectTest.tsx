'use client';

import React, { useState } from 'react';
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, Key, Shield, Activity } from 'lucide-react';

interface SecuritySystem {
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

const mockSystems: SecuritySystem[] = [
  { id: 'SYS-001', name: 'SIEM日志分析平台', ip: '192.168.2.10', status: 'online', lastTest: '2026-06-01 10:30:00', responseTime: 38 },
  { id: 'SYS-002', name: '威胁情报平台', ip: '192.168.2.11', status: 'online', lastTest: '2026-06-01 10:28:00', responseTime: 25 },
  { id: 'SYS-003', name: '漏洞扫描系统', ip: '192.168.2.12', status: 'offline', lastTest: '2026-06-01 09:15:00', responseTime: 0 },
  { id: 'SYS-004', name: '用户行为分析', ip: '192.168.2.13', status: 'online', lastTest: '2026-06-01 10:25:00', responseTime: 52 },
];

const mockCredentials: Credential[] = [
  { id: 'cred-1', name: 'SIEM API密钥', type: 'API', username: 'siem_admin', validUntil: '2026-12-31' },
  { id: 'cred-2', name: '漏洞扫描系统凭证', type: 'SSH', username: 'scanner_user', validUntil: '2026-09-15' },
];

export function SystemConnectTest() {
  const [systems, setSystems] = useState<SecuritySystem[]>(mockSystems);
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [testingSystem, setTestingSystem] = useState<string | null>(null);

  const handleTestConnection = (systemId: string) => {
    setTestingSystem(systemId);
    setSystems(systems.map(s => s.id === systemId ? { ...s, status: 'testing' } : s));
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setSystems(systems.map(s => {
        if (s.id === systemId) {
          return {
            ...s,
            status: success ? 'online' : 'offline',
            lastTest: new Date().toLocaleString('zh-CN'),
            responseTime: success ? Math.floor(Math.random() * 100) + 20 : 0,
          };
        }
        return s;
      }));
      setTestingSystem(null);
    }, 2000);
  };

  const handleTestAll = () => {
    systems.forEach(system => {
      handleTestConnection(system.id);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-5 h-5 text-[#00C853]" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-[#FF3B30]" />;
      case 'testing':
        return <RefreshCw className="w-5 h-5 text-[#FF9100] animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      offline: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      testing: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
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
      SSH: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      API: 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30',
      SNMP: 'bg-[#00BCD4]/20 text-[#00BCD4] border-cyan-500/30',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  const stats = {
    total: systems.length,
    online: systems.filter(s => s.status === 'online').length,
    offline: systems.filter(s => s.status === 'offline').length,
    avgResponse: systems.filter(s => s.responseTime > 0).length > 0
      ? Math.round(systems.filter(s => s.responseTime > 0).reduce((sum, s) => sum + s.responseTime, 0) / systems.filter(s => s.responseTime > 0).length)
      : 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">系统连接与认证测试</h1>
        <p className="text-[#9CA3AF]">测试安全系统连接状态，管理认证凭据</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0066FF]/20 rounded-lg">
              <Activity className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">系统总数</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00C853]/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-[#00C853]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">在线系统</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">{stats.online}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF3B30]/20 rounded-lg">
              <XCircle className="w-5 h-5 text-[#FF3B30]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">离线系统</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">{stats.offline}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF9100]/20 rounded-lg">
              <Clock className="w-5 h-5 text-[#FF9100]" />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-sm">平均响应</p>
              <p className="text-2xl font-bold text-[#F3F4F6]">{stats.avgResponse}ms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h3 className="text-[#F3F4F6] font-semibold">连通性监测</h3>
          <button
            onClick={handleTestAll}
            disabled={testingSystem !== null}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#2A354D] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${testingSystem !== null ? 'animate-spin' : ''}`} />
            全部测试
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">系统名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">响应时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">最后测试</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {systems.map(system => (
              <tr key={system.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(system.status)}
                    {getStatusBadge(system.status)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{system.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{system.ip}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">
                  {system.responseTime > 0 ? `${system.responseTime}ms` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{system.lastTest}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleTestConnection(system.id)}
                    disabled={testingSystem === system.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#181F32] hover:bg-[#2A354D] disabled:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
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
      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#FF9100]" />
            <h3 className="text-[#F3F4F6] font-semibold">凭据管理</h3>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">凭据名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">用户名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">有效期至</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {credentials.map(cred => (
              <tr key={cred.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{cred.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getCredentialTypeBadge(cred.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{cred.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{cred.validUntil}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#00C853]/20 text-[#00C853] border border-green-500/30">
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
