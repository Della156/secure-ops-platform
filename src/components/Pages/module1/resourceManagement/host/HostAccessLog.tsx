'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, X, Tag, FolderOpen, Download, Filter, Eye, Calendar, User, Activity, Shield, FileText } from 'lucide-react';

interface AccessLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  targetHost: string;
  resource: string;
  result: 'success' | 'failed' | 'warning';
  details: string;
  ipAddress: string;
}

const mockLogs: AccessLog[] = [
  { id: 'log-1', timestamp: '2026-06-01 10:30:45', user: '张三', action: 'SSH登录', targetHost: '生产Web服务器', resource: '/home/admin', result: 'success', details: '成功登录服务器', ipAddress: '192.168.1.100' },
  { id: 'log-2', timestamp: '2026-06-01 10:28:12', user: '李四', action: '文件上传', targetHost: '数据库服务器', resource: '/tmp/backup.sql', result: 'success', details: '上传数据库备份文件', ipAddress: '192.168.1.101' },
  { id: 'log-3', timestamp: '2026-06-01 10:15:33', user: '王五', action: '命令执行', targetHost: '缓存服务器', resource: 'rm -rf /data', result: 'warning', details: '执行了危险命令', ipAddress: '192.168.1.102' },
  { id: 'log-4', timestamp: '2026-06-01 09:45:21', user: '赵六', action: 'SSH登录', targetHost: '备份服务器', resource: '管理界面', result: 'failed', details: '密码错误', ipAddress: '192.168.1.103' },
];

export function HostAccessLog() {
  const [logs, setLogs] = useState<AccessLog[]>(mockLogs);
  const [searchText, setSearchText] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterResult, setFilterResult] = useState('');
  const [filterHost, setFilterHost] = useState('');
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchSearch = !searchText || 
                       log.user.toLowerCase().includes(searchText.toLowerCase()) ||
                       log.action.toLowerCase().includes(searchText.toLowerCase()) ||
                       log.details.toLowerCase().includes(searchText.toLowerCase());
    const matchUser = !filterUser || log.user === filterUser;
    const matchResult = !filterResult || log.result === filterResult;
    const matchHost = !filterHost || log.targetHost === filterHost;
    return matchSearch && matchUser && matchResult && matchHost;
  });

  const users = [...new Set(logs.map(l => l.user))];
  const hosts = [...new Set(logs.map(l => l.targetHost))];

  const getResultBadge = (result: string) => {
    const styles = {
      success: 'bg-[#00C853]/20 text-[#00C853] border-green-500/30',
      failed: 'bg-[#FF3B30]/20 text-[#FF3B30] border-red-500/30',
      warning: 'bg-[#FF9100]/20 text-[#FF9100] border-yellow-500/30',
    };
    const labels = {
      success: '成功',
      failed: '失败',
      warning: '警告',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[result as keyof typeof styles]}`}>
        {labels[result as keyof typeof labels]}
      </span>
    );
  };

  const getActionIcon = (action: string) => {
    if (action.includes('登录')) return <User className="w-4 h-4" />;
    if (action.includes('文件')) return <FileText className="w-4 h-4" />;
    if (action.includes('命令')) return <Shield className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const handleExport = () => {
    const csv = [
      ['时间', '用户', '动作', '目标主机', '资源', '结果', '详情', 'IP地址'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp, log.user, log.action, log.targetHost, log.resource, log.result, log.details, log.ipAddress
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `host_access_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[#F3F4F6] mb-4">主机访问日志查询</h1>
        <p className="text-[#9CA3AF]">查看和分析主机的访问操作记录</p>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-start justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="搜索用户、动作或详情..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0066FF] w-64"
              />
            </div>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部用户</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <select
              value={filterHost}
              onChange={(e) => setFilterHost(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部主机</option>
              {hosts.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
              <option value="warning">警告</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#181F32] hover:bg-[#2A354D] text-[#D1D5DB] rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            导出CSV
          </button>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#181F32]/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">动作</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">目标主机</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">资源</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">结果</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">IP地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A354D]">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-[#181F32]/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{log.timestamp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F3F4F6] font-medium">{log.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">
                  <div className="flex items-center gap-2">
                    <span className={log.result === 'success' ? 'text-[#00C853]' : log.result === 'failed' ? 'text-[#FF3B30]' : 'text-[#FF9100]'}>
                      {getActionIcon(log.action)}
                    </span>
                    {log.action}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{log.targetHost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">{log.resource}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getResultBadge(log.result)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF] font-mono">{log.ipAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1.5 text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-[#4A5570]/10 rounded transition-colors"
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
            <p className="text-[#6B7280]">暂无符合条件的日志记录</p>
          </div>
        )}
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-[#2A354D]">
              <h3 className="text-lg font-semibold text-[#F3F4F6]">日志详情</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181F32] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">时间</label>
                  <p className="text-[#F3F4F6]">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">用户</label>
                  <p className="text-[#F3F4F6]">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">动作</label>
                  <p className="text-[#F3F4F6]">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">结果</label>
                  {getResultBadge(selectedLog.result)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">目标主机</label>
                  <p className="text-[#F3F4F6]">{selectedLog.targetHost}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">IP地址</label>
                  <p className="text-[#F3F4F6] font-mono">{selectedLog.ipAddress}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">访问资源</label>
                <p className="text-[#F3F4F6]">{selectedLog.resource}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-1">详细信息</label>
                <div className="bg-[#181F32] rounded-lg p-3">
                  <p className="text-[#D1D5DB]">{selectedLog.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
