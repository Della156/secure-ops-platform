'use client';

import React, { useState } from 'react';
import { Search, FileText, Database, CheckCircle, XCircle, AlertTriangle, Server } from 'lucide-react';

interface LogSource {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'error';
  sourceCount: number;
  lastSync: string;
  description: string;
}

const mockData: LogSource[] = [
  { id: 'LOG-001', name: '安全设备日志', type: 'Syslog', status: 'running', sourceCount: 15, lastSync: '2026-06-02 10:30:00', description: '收集防火墙、IDS、WAF等安全设备日志' },
  { id: 'LOG-002', name: '操作系统日志', type: 'Agent', status: 'running', sourceCount: 50, lastSync: '2026-06-02 10:30:00', description: '收集服务器操作系统日志' },
  { id: 'LOG-003', name: '中间件日志', type: 'File', status: 'running', sourceCount: 20, lastSync: '2026-06-02 10:28:00', description: '收集Tomcat、Nginx等中间件日志' },
  { id: 'LOG-004', name: '数据库日志', type: 'Agent', status: 'stopped', sourceCount: 10, lastSync: '2026-06-02 09:00:00', description: '收集数据库审计日志' },
  { id: 'LOG-005', name: '应用日志', type: 'API', status: 'running', sourceCount: 35, lastSync: '2026-06-02 10:29:00', description: '收集业务应用日志' },
];

export function LogProcessingView() {
  const [data] = useState<LogSource[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    running: data.filter(d => d.status === 'running').length,
    stopped: data.filter(d => d.status === 'stopped').length,
    error: data.filter(d => d.status === 'error').length,
    totalSources: data.reduce((sum, d) => sum + d.sourceCount, 0),
  };

  const getStatusBadge = (status: string) => {
    if (status === 'running') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">运行中</span>;
    if (status === 'stopped') return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">已停止</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">错误</span>;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'Syslog') return <Server className="w-4 h-4 text-blue-400" />;
    if (type === 'Agent') return <Database className="w-4 h-4 text-green-400" />;
    return <FileText className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">日志处理视图</h2>
        <p className="text-sm text-gray-400 mt-1">管理和监控日志数据的收集与处理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">日志源总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">运行中</p>
              <p className="text-xl font-semibold text-green-400">{stats.running}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">已停止</p>
              <p className="text-xl font-semibold text-gray-400">{stats.stopped}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">错误</p>
              <p className="text-xl font-semibold text-red-400">{stats.error}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">数据源数量</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.totalSources}</p>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">日志源名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数据源数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后同步</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">描述</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm text-gray-400">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.sourceCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastSync}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <p className="text-gray-500 text-center py-8">暂无数据</p>}
      </div>
    </div>
  );
}