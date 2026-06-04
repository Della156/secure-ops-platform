'use client';

import React, { useState } from 'react';
import { AlertTriangle, Search, Filter, Bell, Download, Eye, Clock, Server, AlertCircle } from 'lucide-react';

interface AlertLog {
  id: string;
  apiName: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  ip: string;
  statusCode: number;
  requestId: string;
}

export function ApiExceptionAlert() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const mockLogs: AlertLog[] = [
    { id: 'LOG-001', apiName: '日志查询API', level: 'error', message: '数据库连接超时', timestamp: '2026-06-04 10:35:23', ip: '192.168.1.100', statusCode: 500, requestId: 'req-abc123' },
    { id: 'LOG-002', apiName: '告警推送API', level: 'warning', message: '请求频率超限', timestamp: '2026-06-04 10:34:15', ip: '192.168.1.101', statusCode: 429, requestId: 'req-def456' },
    { id: 'LOG-003', apiName: '报表生成API', level: 'error', message: '内存不足', timestamp: '2026-06-04 10:33:45', ip: '192.168.1.102', statusCode: 503, requestId: 'req-ghi789' },
    { id: 'LOG-004', apiName: '威胁情报API', level: 'warning', message: '响应时间过长', timestamp: '2026-06-04 10:32:12', ip: '192.168.1.103', statusCode: 200, requestId: 'req-jkl012' },
    { id: 'LOG-005', apiName: '用户数据API', level: 'info', message: '访问频次异常', timestamp: '2026-06-04 10:31:56', ip: '192.168.1.104', statusCode: 200, requestId: 'req-mno345' },
    { id: 'LOG-006', apiName: '资产查询API', level: 'error', message: '认证失败', timestamp: '2026-06-04 10:30:34', ip: '192.168.1.105', statusCode: 401, requestId: 'req-pqr678' },
    { id: 'LOG-007', apiName: '日志查询API', level: 'warning', message: '查询超时', timestamp: '2026-06-04 10:29:18', ip: '192.168.1.106', statusCode: 504, requestId: 'req-stu901' },
    { id: 'LOG-008', apiName: '告警推送API', level: 'error', message: '目标服务不可达', timestamp: '2026-06-04 10:28:45', ip: '192.168.1.107', statusCode: 503, requestId: 'req-vwx234' },
  ];

  const filteredLogs = mockLogs.filter(item => 
    item.apiName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLevel === 'all' || item.level === filterLevel)
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Bell className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'error': return '错误';
      case 'warning': return '警告';
      case 'info': return '信息';
      default: return level;
    }
  };

  const stats = {
    total: mockLogs.length,
    error: mockLogs.filter(l => l.level === 'error').length,
    warning: mockLogs.filter(l => l.level === 'warning').length,
    info: mockLogs.filter(l => l.level === 'info').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">API调用异常告警与日志</h2>
          <p className="text-sm text-gray-400 mt-1">监控API异常调用，记录告警日志，便于排查问题</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20293F] border border-[#2A354D] text-gray-300 rounded text-sm hover:bg-[#2A354D]">
          <Download className="w-4 h-4" />
          导出日志
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">今日告警</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">错误</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.error}</div>
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
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">信息</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.info}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索API名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部级别</option>
              <option value="error">错误</option>
              <option value="warning">警告</option>
              <option value="info">信息</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">级别</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">API名称</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">错误信息</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态码</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getLevelColor(item.level)}`}>
                    {getLevelIcon(item.level)}
                    {getLevelLabel(item.level)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-white">{item.apiName}</td>
                <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">{item.message}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.statusCode}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.ip}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.timestamp}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-blue-400">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredLogs.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#20293F] hover:bg-[#2A354D] rounded text-gray-300 disabled opacity-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiExceptionAlert;