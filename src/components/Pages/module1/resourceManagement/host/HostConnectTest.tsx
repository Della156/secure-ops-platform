'use client';

import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Plus, Edit, Trash2, X, CheckCircle2, XCircle, AlertCircle, Activity, Clock, Shield, Key, Lock } from 'lucide-react';

interface HostCredential {
  id: string;
  name: string;
  host: string;
  username: string;
  protocol: 'ssh' | 'winrm' | 'rdp';
  port: number;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
}

const mockCredentials: HostCredential[] = [
  { id: 'cred-1', name: '生产Web服务器', host: '10.0.1.101', username: 'admin', protocol: 'ssh', port: 22, status: 'connected', lastConnected: '2026-06-01 10:30:00' },
  { id: 'cred-2', name: '数据库服务器', host: '10.0.1.102', username: 'root', protocol: 'ssh', port: 22, status: 'connected', lastConnected: '2026-06-01 09:15:00' },
  { id: 'cred-3', name: '缓存服务器', host: '10.0.1.103', username: 'admin', protocol: 'ssh', port: 22, status: 'error', lastConnected: '2026-05-31 18:45:00' },
  { id: 'cred-4', name: '备份服务器', host: '10.0.1.104', username: 'admin', protocol: 'ssh', port: 22, status: 'disconnected', lastConnected: '2026-05-30 12:00:00' },
];

interface ConnectivityLog {
  id: string;
  host: string;
  timestamp: string;
  action: string;
  result: 'success' | 'failed' | 'warning';
  duration: string;
}

const mockLogs: ConnectivityLog[] = [
  { id: 'log-1', host: '10.0.1.101', timestamp: '2026-06-01 10:30:45', action: 'SSH连接测试', result: 'success', duration: '125ms' },
  { id: 'log-2', host: '10.0.1.102', timestamp: '2026-06-01 10:28:12', action: 'SSH连接测试', result: 'success', duration: '89ms' },
  { id: 'log-3', host: '10.0.1.103', timestamp: '2026-06-01 10:25:33', action: 'SSH连接测试', result: 'failed', duration: '5000ms' },
  { id: 'log-4', host: '10.0.1.104', timestamp: '2026-06-01 09:45:21', action: 'SSH连接测试', result: 'warning', duration: '2500ms' },
];

export function HostConnectTest() {
  const [credentials, setCredentials] = useState<HostCredential[]>(mockCredentials);
  const [logs, setLogs] = useState<ConnectivityLog[]>(mockLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<HostCredential | null>(null);
  const [testingIds, setTestingIds] = useState<Set<string>>(new Set());
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);
  const [formData, setFormData] = useState<Partial<HostCredential>>({
    name: '',
    host: '',
    username: '',
    protocol: 'ssh',
    port: 22,
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      connected: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      disconnected: 'bg-[#4A5570]/20 text-[#9CA3AF] border-[#4A5570]/30',
      error: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
    };
    const labels = {
      connected: '已连接',
      disconnected: '未连接',
      error: '连接错误',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getProtocolBadge = (protocol: string) => {
    const styles = {
      ssh: 'bg-[#0066FF]/20 text-[#0066FF] border-blue-500/30',
      winrm: 'bg-[#6366F1]/20 text-[#6366F1] border-purple-500/30',
      rdp: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[protocol as keyof typeof styles]}`}>
        {protocol.toUpperCase()}
      </span>
    );
  };

  const handleTestConnection = async (id: string) => {
    setTestingIds(prev => new Set(prev).add(id));
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = Math.random() > 0.3;
    setCredentials(prev => prev.map(c => c.id === id ? {
      ...c,
      status: success ? 'connected' : 'error',
      lastConnected: new Date().toLocaleString()
    } : c));
    const cred = credentials.find(c => c.id === id);
    if (cred) {
      const newLog: ConnectivityLog = {
        id: `log-${Date.now()}`,
        host: cred.host,
        timestamp: new Date().toLocaleString(),
        action: 'SSH连接测试',
        result: success ? 'success' : 'failed',
        duration: success ? `${Math.floor(Math.random() * 200 + 50)}ms` : '5000ms',
      };
      setLogs(prev => [newLog, ...prev]);
    }
    setTestingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleTestAll = async () => {
    setIsAutoTestRunning(true);
    for (const cred of credentials) {
      await handleTestConnection(cred.id);
    }
    setIsAutoTestRunning(false);
  };

  const handleSaveCredential = () => {
    if (!formData.name || !formData.host) return;
    if (editingCredential) {
      setCredentials(credentials.map(c => c.id === editingCredential.id ? { ...c, ...formData } as HostCredential : c));
    } else {
      setCredentials([...credentials, { ...formData, id: `cred-${Date.now()}`, status: 'disconnected', lastConnected: '-' } as HostCredential]);
    }
    setIsModalOpen(false);
    setEditingCredential(null);
  };

  const handleDeleteCredential = (id: string) => {
    setCredentials(credentials.filter(c => c.id !== id));
  };

  const stats = {
    connected: credentials.filter(c => c.status === 'connected').length,
    disconnected: credentials.filter(c => c.status === 'disconnected').length,
    error: credentials.filter(c => c.status === 'error').length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">主机连接测试</h1>
          <p className="text-[#9CA3AF]">测试主机连接状态和管理连接凭证</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTestAll}
            disabled={isAutoTestRunning || testingIds.size > 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#00C853] hover:bg-[#00A843] disabled:bg-[#2A354D] disabled:cursor-not-allowed text-[#F3F4F6] rounded-lg transition-colors"
          >
            {isAutoTestRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoTestRunning ? '测试中...' : '测试全部'}
          </button>
          <button
            onClick={() => {
              setEditingCredential(null);
              setFormData({ name: '', host: '', username: '', protocol: 'ssh', port: 22 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加凭证
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">已连接</span>
            <CheckCircle2 className="w-5 h-5 text-[#00C853]" />
          </div>
          <div className="text-3xl font-bold text-[#00C853]">{stats.connected}</div>
          <div className="text-[#6B7280] text-sm">主机正常连接</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">未连接</span>
            <Activity className="w-5 h-5 text-[#9CA3AF]" />
          </div>
          <div className="text-3xl font-bold text-[#9CA3AF]">{stats.disconnected}</div>
          <div className="text-[#6B7280] text-sm">等待连接测试</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9CA3AF] text-sm">连接错误</span>
            <XCircle className="w-5 h-5 text-[#FF3B30]" />
          </div>
          <div className="text-3xl font-bold text-[#FF3B30]">{stats.error}</div>
          <div className="text-[#6B7280] text-sm">需要检查配置</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
              <Key className="w-5 h-5" />
              连接凭证
            </h2>
          </div>
          <div className="space-y-3">
            {credentials.map(cred => (
              <div key={cred.id} className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[#F3F4F6] font-medium">{cred.name}</h3>
                      {getProtocolBadge(cred.protocol)}
                      {getStatusBadge(cred.status)}
                    </div>
                    <div className="text-[#9CA3AF] text-sm font-mono">{cred.host}:{cred.port}</div>
                    <div className="text-[#6B7280] text-sm">用户: {cred.username}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(cred.id)}
                      disabled={testingIds.has(cred.id)}
                      className="p-2 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-[#2A354D] disabled:cursor-not-allowed text-[#F3F4F6] rounded-lg transition-colors"
                      title="测试连接"
                    >
                      {testingIds.has(cred.id) ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCredential(cred);
                        setFormData(cred);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCredential(cred.id)}
                      className="p-2 text-[#9CA3AF] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>最后连接: {cred.lastConnected}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
              <Activity className="w-5 h-5" />
              连接日志
            </h2>
            <button
              onClick={() => {}}
              className="text-sm text-[#9CA3AF] hover:text-[#F3F4F6] flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
          </div>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="flex items-center gap-4 px-4 py-3 border-b border-[#2A354D] last:border-0 hover:bg-[#181F32]/50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    log.result === 'success' ? 'bg-[#00C853]/20 text-[#00C853]' :
                    log.result === 'failed' ? 'bg-[#FF3B30]/20 text-[#FF3B30]' :
                    'bg-[#FF9100]/20 text-[#FF9100]'
                  }`}>
                    {log.result === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                     log.result === 'failed' ? <XCircle className="w-4 h-4" /> :
                     <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#F3F4F6] text-sm font-medium">{log.host}</span>
                      <span className="text-[#6B7280] text-sm">{log.action}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#9CA3AF] text-xs">
                      <span>{log.timestamp}</span>
                      <span className="text-[#6B7280]">耗时: {log.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">
                {editingCredential ? '编辑凭证' : '添加凭证'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1">凭证名称</label>
                <input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="例如：生产Web服务器"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">主机地址</label>
                  <input
                    value={formData.host || ''}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                    placeholder="10.0.1.101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">端口</label>
                  <input
                    type="number"
                    value={formData.port || ''}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 22 })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">协议</label>
                  <select
                    value={formData.protocol || 'ssh'}
                    onChange={(e) => setFormData({ ...formData, protocol: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  >
                    <option value="ssh">SSH</option>
                    <option value="winrm">WinRM</option>
                    <option value="rdp">RDP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-1">用户名</label>
                  <input
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#D1D5DB] mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  密码/密钥
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                  placeholder="输入密码或选择密钥文件"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveCredential}
                  className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-[#F3F4F6] rounded-lg transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
