'use client';

import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Plus, Edit, Trash2, X, CheckCircle2, XCircle, AlertCircle, Activity, Clock, Shield, Key, Lock } from 'lucide-react';

interface EndpointCredential {
  id: string;
  name: string;
  endpoint: string;
  username: string;
  protocol: 'ssh' | 'winrm' | 'rdp' | 'vnc';
  port: number;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
}

const mockCredentials: EndpointCredential[] = [
  { id: 'cred-1', name: '办公终端001', endpoint: '192.168.1.101', username: 'admin', protocol: 'rdp', port: 3389, status: 'connected', lastConnected: '2026-06-01 10:30:00' },
  { id: 'cred-2', name: '研发终端001', endpoint: '192.168.1.102', username: 'developer', protocol: 'ssh', port: 22, status: 'connected', lastConnected: '2026-06-01 09:15:00' },
  { id: 'cred-3', name: '财务终端001', endpoint: '192.168.1.103', username: 'finance', protocol: 'rdp', port: 3389, status: 'error', lastConnected: '2026-05-31 18:45:00' },
  { id: 'cred-4', name: '访客终端001', endpoint: '192.168.1.104', username: 'guest', protocol: 'vnc', port: 5900, status: 'disconnected', lastConnected: '2026-05-30 12:00:00' },
];

interface ConnectivityLog {
  id: string;
  endpoint: string;
  timestamp: string;
  action: string;
  result: 'success' | 'failed' | 'warning';
  duration: string;
}

const mockLogs: ConnectivityLog[] = [
  { id: 'log-1', endpoint: '192.168.1.101', timestamp: '2026-06-01 10:30:45', action: 'RDP连接测试', result: 'success', duration: '125ms' },
  { id: 'log-2', endpoint: '192.168.1.102', timestamp: '2026-06-01 10:28:12', action: 'SSH连接测试', result: 'success', duration: '89ms' },
  { id: 'log-3', endpoint: '192.168.1.103', timestamp: '2026-06-01 10:25:33', action: 'RDP连接测试', result: 'failed', duration: '5000ms' },
  { id: 'log-4', endpoint: '192.168.1.104', timestamp: '2026-06-01 09:45:21', action: 'VNC连接测试', result: 'warning', duration: '2500ms' },
];

export function EndpointConnectTest() {
  const [credentials, setCredentials] = useState<EndpointCredential[]>(mockCredentials);
  const [logs, setLogs] = useState<ConnectivityLog[]>(mockLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<EndpointCredential | null>(null);
  const [testingIds, setTestingIds] = useState<Set<string>>(new Set());
  const [isAutoTestRunning, setIsAutoTestRunning] = useState(false);
  const [formData, setFormData] = useState<Partial<EndpointCredential>>({
    name: '',
    endpoint: '',
    username: '',
    protocol: 'rdp',
    port: 3389,
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      connected: 'bg-green-500/20 text-green-400 border-green-500/30',
      disconnected: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
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
      ssh: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      winrm: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      rdp: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      vnc: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
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
        endpoint: cred.endpoint,
        timestamp: new Date().toLocaleString(),
        action: `${cred.protocol.toUpperCase()}连接测试`,
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
    if (!formData.name || !formData.endpoint) return;
    if (editingCredential) {
      setCredentials(credentials.map(c => c.id === editingCredential.id ? { ...c, ...formData } as EndpointCredential : c));
    } else {
      setCredentials([...credentials, { ...formData, id: `cred-${Date.now()}`, status: 'disconnected', lastConnected: '-' } as EndpointCredential]);
    }
    setIsModalOpen(false);
    setEditingCredential(null);
  };

  const handleDeleteCredential = (id: string) => {
    if (confirm('确定要删除这个凭证吗？')) {
      setCredentials(credentials.filter(c => c.id !== id));
    }
  };

  const stats = {
    connected: credentials.filter(c => c.status === 'connected').length,
    disconnected: credentials.filter(c => c.status === 'disconnected').length,
    error: credentials.filter(c => c.status === 'error').length,
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">终端连接与认证测试</h1>
          <p className="text-slate-400">测试终端连接状态和管理连接凭证</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTestAll}
            disabled={isAutoTestRunning || testingIds.size > 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isAutoTestRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoTestRunning ? '测试中...' : '测试全部'}
          </button>
          <button
            onClick={() => {
              setEditingCredential(null);
              setFormData({ name: '', endpoint: '', username: '', protocol: 'rdp', port: 3389 });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加凭证
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">已连接</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.connected}</div>
          <div className="text-slate-500 text-sm">终端正常连接</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">未连接</span>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-slate-400">{stats.disconnected}</div>
          <div className="text-slate-500 text-sm">等待连接测试</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">连接错误</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{stats.error}</div>
          <div className="text-slate-500 text-sm">需要检查配置</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              连接凭证
            </h2>
          </div>
          <div className="space-y-3">
            {credentials.map(cred => (
              <div key={cred.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-medium">{cred.name}</h3>
                      {getProtocolBadge(cred.protocol)}
                      {getStatusBadge(cred.status)}
                    </div>
                    <div className="text-slate-400 text-sm font-mono">{cred.endpoint}:{cred.port}</div>
                    <div className="text-slate-500 text-sm">用户: {cred.username}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(cred.id)}
                      disabled={testingIds.has(cred.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCredential(cred.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>最后连接: {cred.lastConnected}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              连接日志
            </h2>
            <button
              onClick={() => {}}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {logs.map(log => (
                <div key={log.id} className="flex items-center gap-4 px-4 py-3 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    log.result === 'success' ? 'bg-green-500/20 text-green-400' :
                    log.result === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {log.result === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                     log.result === 'failed' ? <XCircle className="w-4 h-4" /> :
                     <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">{log.endpoint}</span>
                      <span className="text-slate-500 text-sm">{log.action}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <span>{log.timestamp}</span>
                      <span className="text-slate-500">耗时: {log.duration}</span>
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
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {editingCredential ? '编辑凭证' : '添加凭证'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">凭证名称</label>
                <input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：办公终端001"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">终端地址</label>
                  <input
                    value={formData.endpoint || ''}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="192.168.1.101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">端口</label>
                  <input
                    type="number"
                    value={formData.port || ''}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 3389 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">协议</label>
                  <select
                    value={formData.protocol || 'rdp'}
                    onChange={(e) => {
                      const proto = e.target.value as 'ssh' | 'winrm' | 'rdp' | 'vnc';
                      const portMap: Record<string, number> = { ssh: 22, winrm: 5985, rdp: 3389, vnc: 5900 };
                      setFormData({ ...formData, protocol: proto, port: portMap[proto] });
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ssh">SSH</option>
                    <option value="winrm">WinRM</option>
                    <option value="rdp">RDP</option>
                    <option value="vnc">VNC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">用户名</label>
                  <input
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  密码
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入密码"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveCredential}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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