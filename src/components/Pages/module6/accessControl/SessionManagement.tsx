'use client';

import React, { useState } from 'react';
import { Search, X, Clock, User, Monitor } from 'lucide-react';

interface Session {
  id: string;
  username: string;
  ip: string;
  device: string;
  loginTime: string;
  expireTime: string;
  status: 'active' | 'idle' | 'expired';
}

export function SessionManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockSessions: Session[] = [
    { id: 'S001', username: 'admin', ip: '192.168.1.100', device: 'Windows PC', loginTime: '2026-06-04 09:00:00', expireTime: '2026-06-04 18:00:00', status: 'active' },
    { id: 'S002', username: 'user01', ip: '192.168.1.101', device: 'MacBook Pro', loginTime: '2026-06-04 10:00:00', expireTime: '2026-06-04 19:00:00', status: 'active' },
    { id: 'S003', username: 'user02', ip: '192.168.1.102', device: 'iPhone', loginTime: '2026-06-04 11:00:00', expireTime: '2026-06-04 20:00:00', status: 'idle' },
    { id: 'S004', username: 'user03', ip: '192.168.1.103', device: 'Windows PC', loginTime: '2026-06-04 08:00:00', expireTime: '2026-06-04 17:00:00', status: 'expired' },
    { id: 'S005', username: 'user04', ip: '192.168.1.105', device: 'Android', loginTime: '2026-06-04 10:30:00', expireTime: '2026-06-04 19:30:00', status: 'active' },
  ];

  const filteredSessions = mockSessions.filter(session => 
    session.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: mockSessions.length,
    active: mockSessions.filter(s => s.status === 'active').length,
    idle: mockSessions.filter(s => s.status === 'idle').length,
  };

  const terminateSession = (id: string) => {
    console.log('Terminate session:', id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">会话管理</h2>
          <p className="text-sm text-gray-400 mt-1">管理用户登录会话，强制下线异常会话</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">总会话数</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">活跃会话</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">空闲会话</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.idle}</div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center gap-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索用户名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111625] border border-[#2A354D] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">用户名</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">设备</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">登录时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">过期时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3 font-medium text-white">{session.username}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{session.ip}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{session.device}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{session.loginTime}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{session.expireTime}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    session.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {session.status === 'active' ? '活跃' : session.status === 'idle' ? '空闲' : '已过期'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => terminateSession(session.id)}
                    className="p-1.5 hover:bg-[#111625] rounded text-gray-400 hover:text-red-400"
                    title="强制下线"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredSessions.length} 条记录</span>
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

export default SessionManagement;