'use client';

import React, { useState } from 'react';
import { Search, Download, Filter, Eye, Calendar, User, Activity, Shield, FileText } from 'lucide-react';

interface AccessLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  targetDevice: string;
  resource: string;
  result: 'success' | 'failed' | 'warning';
  details: string;
  ipAddress: string;
}

const mockLogs: AccessLog[] = [
  { id: 'log-1', timestamp: '2026-06-01 10:30:45', user: '张三', action: '登录', targetDevice: '主防火墙-FW-01', resource: '管理界面', result: 'success', details: '用户成功登录系统', ipAddress: '192.168.1.100' },
  { id: 'log-2', timestamp: '2026-06-01 10:28:12', user: '李四', action: '修改配置', targetDevice: '入侵检测系统-IDS-01', resource: '规则配置', result: 'success', details: '更新了入侵检测规则', ipAddress: '192.168.1.101' },
  { id: 'log-3', timestamp: '2026-06-01 10:15:33', user: '王五', action: '访问日志', targetDevice: 'Web应用防火墙-WAF-01', resource: '审计日志', result: 'warning', details: '访问敏感日志记录', ipAddress: '192.168.1.102' },
  { id: 'log-4', timestamp: '2026-06-01 09:45:21', user: '赵六', action: '登录', targetDevice: '终端安全管理-EDR-01', resource: '管理界面', result: 'failed', details: '密码错误', ipAddress: '192.168.1.103' },
  { id: 'log-5', timestamp: '2026-06-01 09:30:00', user: '系统', action: '自动备份', targetDevice: '主防火墙-FW-01', resource: '配置文件', result: 'success', details: '定时备份任务执行完成', ipAddress: '127.0.0.1' },
];

export function DeviceAccessLog() {
  const [logs, setLogs] = useState<AccessLog[]>(mockLogs);
  const [searchText, setSearchText] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [filterDevice, setFilterDevice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchSearch = !searchText || 
                       log.user.toLowerCase().includes(searchText.toLowerCase()) ||
                       log.action.toLowerCase().includes(searchText.toLowerCase()) ||
                       log.details.toLowerCase().includes(searchText.toLowerCase());
    const matchUser = !filterUser || log.user === filterUser;
    const matchResult = !filterResult || log.result === filterResult;
    const matchDevice = !filterDevice || log.targetDevice === filterDevice;
    return matchSearch && matchUser && matchResult && matchDevice;
  });

  const users = [...new Set(logs.map(l => l.user))];
  const devices = [...new Set(logs.map(l => l.targetDevice))];

  const getResultBadge = (result: string) => {
    const styles = {
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    const labels = { success: '成功', failed: '失败', warning: '警告' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[result as keyof typeof styles]}`}>
        {labels[result as keyof typeof labels]}
      </span>
    );
  };

  const getActionIcon = (action: string) => {
    if (action.includes('登录')) return <User className="w-4 h-4" />;
    if (action.includes('备份')) return <FileText className="w-4 h-4" />;
    if (action.includes('配置')) return <Shield className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const handleExport = () => {
    const csv = [
      ['时间', '用户', '动作', '目标设备', '资源', '结果', '详情', 'IP地址'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp, log.user, log.action, log.targetDevice, log.resource, log.result, log.details, log.ipAddress
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `device_access_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">设备访问日志查询</h1>
        <p className="text-slate-400">查看和分析设备的访问操作记录</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索用户、动作或详情..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部用户</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部设备</option>
              {devices.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="warning">警告</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">动作</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">目标设备</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">资源</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">结果</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">IP地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{log.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className={log.result === 'success' ? 'text-green-400' : log.result === 'failed' ? 'text-red-400' : 'text-yellow-400'}>
                      {getActionIcon(log.action)}
                    </span>
                    {log.action}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{log.targetDevice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{log.resource}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getResultBadge(log.result)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{log.ipAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-500/10 rounded transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">暂无符合条件的日志记录</p>
          </div>
        )}
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">日志详情</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">时间</label>
                  <p className="text-white">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">用户</label>
                  <p className="text-white">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">动作</label>
                  <p className="text-white">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">结果</label>
                  {getResultBadge(selectedLog.result)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">目标设备</label>
                  <p className="text-white">{selectedLog.targetDevice}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">IP地址</label>
                  <p className="text-white font-mono">{selectedLog.ipAddress}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">访问资源</label>
                <p className="text-white">{selectedLog.resource}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">详细信息</label>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-300">{selectedLog.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
