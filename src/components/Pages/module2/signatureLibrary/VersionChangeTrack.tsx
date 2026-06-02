'use client';

import React, { useState } from 'react';
import { Search, Calendar, ArrowUp, ArrowDown, RefreshCw, Clock } from 'lucide-react';

interface ChangeRecord {
  id: string;
  libraryName: string;
  deviceName: string;
  ip: string;
  oldVersion: string;
  newVersion: string;
  changeType: 'update' | 'rollback' | 'manual';
  changeTime: string;
  operator: string;
  reason: string;
}

const mockData: ChangeRecord[] = [
  { id: 'CR-001', libraryName: '威胁情报库', deviceName: '防火墙-FW-01', ip: '192.168.1.254', oldVersion: '2026.06.01', newVersion: '2026.06.02', changeType: 'update', changeTime: '2026-06-02 02:00:00', operator: '系统自动', reason: '自动更新' },
  { id: 'CR-002', libraryName: 'IP信誉库', deviceName: '入侵检测-IDS-01', ip: '192.168.1.10', oldVersion: '2026.06.01', newVersion: '2026.06.02', changeType: 'update', changeTime: '2026-06-02 00:30:00', operator: '系统自动', reason: '自动更新' },
  { id: 'CR-003', libraryName: '病毒特征库', deviceName: 'WAF-01', ip: '192.168.1.20', oldVersion: '2026.05.31', newVersion: '2026.06.01', changeType: 'update', changeTime: '2026-06-01 08:00:00', operator: 'admin', reason: '手动更新' },
  { id: 'CR-004', libraryName: '漏洞特征库', deviceName: '核心交换机-01', ip: '192.168.1.1', oldVersion: '2026.06.01', newVersion: '2026.05.28', changeType: 'rollback', changeTime: '2026-06-01 14:30:00', operator: 'system', reason: '版本回滚' },
  { id: 'CR-005', libraryName: '恶意软件库', deviceName: '日志服务器-01', ip: '192.168.2.50', oldVersion: '2026.05.30', newVersion: '2026.06.01', changeType: 'update', changeTime: '2026-06-01 10:00:00', operator: '系统自动', reason: '自动更新' },
];

export function VersionChangeTrack() {
  const [data] = useState<ChangeRecord[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.libraryName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.deviceName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const getChangeTypeBadge = (type: string) => {
    if (type === 'update') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">更新</span>;
    if (type === 'rollback') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">回滚</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">手动</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">版本号变更跟踪</h2>
        <p className="text-sm text-gray-400 mt-1">追踪特征库版本变更历史，支持变更原因查询和审计</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索特征库/设备..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            刷新记录
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">特征库名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">版本变更</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">变更原因</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white">{item.libraryName}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{item.deviceName}</div>
                    <div className="text-xs text-gray-500">{item.ip}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">{item.oldVersion}</span>
                      {item.changeType === 'rollback' ? (
                        <ArrowDown className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <ArrowUp className="w-4 h-4 text-green-400" />
                      )}
                      <span className="text-sm text-green-400">{item.newVersion}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getChangeTypeBadge(item.changeType)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.changeTime}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.operator}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.reason}</td>
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