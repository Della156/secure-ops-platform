'use client';

import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Shield, User, CheckCircle } from 'lucide-react';

interface AuditRecord {
  id: string;
  username: string;
  ip: string;
  event: string;
  time: string;
  result: 'success' | 'failed';
  riskLevel: 'low' | 'medium' | 'high';
}

export function LoginLogAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const mockRecords: AuditRecord[] = [
    { id: 'A001', username: 'admin', ip: '203.0.113.45', event: '异常登录尝试', time: '2026-06-04 10:33:45', result: 'failed', riskLevel: 'high' },
    { id: 'A002', username: 'unknown', ip: '45.33.32.15', event: '账户不存在尝试', time: '2026-06-04 10:30:34', result: 'failed', riskLevel: 'medium' },
    { id: 'A003', username: 'admin', ip: '192.168.1.104', event: '验证码错误', time: '2026-06-04 10:29:18', result: 'failed', riskLevel: 'low' },
    { id: 'A004', username: 'user02', ip: '10.0.0.5', event: '异地登录', time: '2026-06-04 09:15:22', result: 'success', riskLevel: 'medium' },
    { id: 'A005', username: 'user03', ip: '192.168.1.103', event: '连续失败后成功', time: '2026-06-04 08:45:10', result: 'success', riskLevel: 'high' },
    { id: 'A006', username: 'user01', ip: '192.168.1.101', event: '正常登录', time: '2026-06-04 08:30:00', result: 'success', riskLevel: 'low' },
  ];

  const filteredRecords = mockRecords.filter(record => 
    record.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (riskFilter === 'all' || record.riskLevel === riskFilter)
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
      default: return level;
    }
  };

  const stats = {
    total: mockRecords.length,
    high: mockRecords.filter(r => r.riskLevel === 'high').length,
    medium: mockRecords.filter(r => r.riskLevel === 'medium').length,
    low: mockRecords.filter(r => r.riskLevel === 'low').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">登录日志审计</h2>
          <p className="text-sm text-gray-400 mt-1">审计登录行为，识别异常登录</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">审计记录</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">高风险</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.high}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">中风险</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">低风险</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.low}</div>
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
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-[#111625] border border-[#2A354D] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">全部风险等级</option>
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#111625]">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">用户</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">IP地址</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">事件类型</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">时间</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">结果</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">风险等级</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="border-t border-[#2A354D] hover:bg-[#111625]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">{record.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{record.ip}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{record.event}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{record.time}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${record.result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {record.result === 'success' ? '成功' : '失败'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getRiskColor(record.riskLevel)}`}>
                    {getRiskLabel(record.riskLevel)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 bg-[#111625] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredRecords.length} 条记录</span>
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

export default LoginLogAudit;