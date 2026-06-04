'use client';

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface LoginLog {
  id: string;
  username: string;
  ip: string;
  status: 'success' | 'failed';
  time: string;
  device: string;
  location: string;
  reason?: string;
}

export function LoginLogQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockData: LoginLog[] = [
    { id: 'LOG-001', username: 'admin', ip: '192.168.1.100', status: 'success', time: '2026-06-04 10:35:23', device: 'Windows PC', location: '总部办公室' },
    { id: 'LOG-002', username: 'user01', ip: '192.168.1.101', status: 'success', time: '2026-06-04 10:34:15', device: 'MacBook Pro', location: '研发部' },
    { id: 'LOG-003', username: 'admin', ip: '203.0.113.45', status: 'failed', time: '2026-06-04 10:33:45', device: 'Unknown', location: '境外', reason: '密码错误' },
    { id: 'LOG-004', username: 'user02', ip: '192.168.1.102', status: 'success', time: '2026-06-04 10:32:12', device: 'iPhone', location: '移动办公' },
    { id: 'LOG-005', username: 'user03', ip: '192.168.1.103', status: 'success', time: '2026-06-04 10:31:56', device: 'Windows PC', location: '运维部' },
    { id: 'LOG-006', username: 'unknown', ip: '45.33.32.15', status: 'failed', time: '2026-06-04 10:30:34', device: 'Unknown', location: '境外', reason: '账户不存在' },
    { id: 'LOG-007', username: 'admin', ip: '192.168.1.104', status: 'failed', time: '2026-06-04 10:29:18', device: 'Windows PC', location: '总部办公室', reason: '验证码错误' },
    { id: 'LOG-008', username: 'user04', ip: '192.168.1.105', status: 'success', time: '2026-06-04 10:28:45', device: 'Android', location: '移动办公' },
  ];

  const filteredData = mockData.filter(item => 
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || item.status === filterStatus)
  );

  const stats = {
    total: mockData.length,
    success: mockData.filter(l => l.status === 'success').length,
    failed: mockData.filter(l => l.status === 'failed').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">登录日志查询</h2>
          <p className="text-sm text-gray-400 mt-1">查询用户登录记录，追踪登录行为</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20293F] border border-[#2A354D] text-gray-300 rounded text-sm hover:bg-[#2A354D]">
          <Download className="w-4 h-4" />
          导出日志
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">今日登录</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">成功</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.success}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">失败</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索用户名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">用户名</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">登录时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">设备</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">位置</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">失败原因</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">{item.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.ip}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.time}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.device}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{item.location}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${item.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {item.status === 'success' ? '成功' : '失败'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{item.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredData.length} 条记录</span>
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

export default LoginLogQuery;