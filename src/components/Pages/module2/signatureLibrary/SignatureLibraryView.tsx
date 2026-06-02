'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, Database, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

interface SignatureVersion {
  id: string;
  name: string;
  type: string;
  currentVersion: string;
  latestVersion: string;
  status: 'up-to-date' | 'update-available' | 'critical';
  lastUpdate: string;
  deviceCount: number;
}

const mockData: SignatureVersion[] = [
  { id: 'SIG-001', name: '病毒特征库', type: '安全特征', currentVersion: '2026.06.01', latestVersion: '2026.06.02', status: 'update-available', lastUpdate: '2026-06-01 08:00:00', deviceCount: 45 },
  { id: 'SIG-002', name: '威胁情报库', type: '威胁情报', currentVersion: '2026.06.02', latestVersion: '2026.06.02', status: 'up-to-date', lastUpdate: '2026-06-02 02:00:00', deviceCount: 38 },
  { id: 'SIG-003', name: '漏洞特征库', type: '漏洞特征', currentVersion: '2026.05.28', latestVersion: '2026.06.02', status: 'critical', lastUpdate: '2026-05-28 10:00:00', deviceCount: 22 },
  { id: 'SIG-004', name: '恶意软件库', type: '安全特征', currentVersion: '2026.06.01', latestVersion: '2026.06.01', status: 'up-to-date', lastUpdate: '2026-06-01 14:00:00', deviceCount: 52 },
  { id: 'SIG-005', name: 'URL黑名单库', type: '威胁情报', currentVersion: '2026.06.01', latestVersion: '2026.06.02', status: 'update-available', lastUpdate: '2026-06-01 06:00:00', deviceCount: 48 },
  { id: 'SIG-006', name: 'IP信誉库', type: '威胁情报', currentVersion: '2026.06.02', latestVersion: '2026.06.02', status: 'up-to-date', lastUpdate: '2026-06-02 00:00:00', deviceCount: 35 },
];

export function SignatureLibraryView() {
  const [data] = useState<SignatureVersion[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.includes(searchKeyword)
  );

  const stats = {
    total: data.length,
    upToDate: data.filter(d => d.status === 'up-to-date').length,
    needUpdate: data.filter(d => d.status === 'update-available').length,
    critical: data.filter(d => d.status === 'critical').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'up-to-date') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">最新</span>;
    if (status === 'update-available') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">待更新</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">严重</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">特征库版本检查视图</h2>
        <p className="text-sm text-gray-400 mt-1">查看和管理各类安全特征库的版本状态，及时更新确保防护能力</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">特征库总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已更新</p>
              <p className="text-xl font-semibold text-green-400">{stats.upToDate}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">待更新</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.needUpdate}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">严重滞后</p>
              <p className="text-xl font-semibold text-red-400">{stats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索特征库名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            检查更新
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">特征库名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最新版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">关联设备数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">最后更新</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.currentVersion}</td>
                  <td className="px-4 py-3">
                    {item.currentVersion !== item.latestVersion ? (
                      <span className="text-sm text-green-400">{item.latestVersion}</span>
                    ) : (
                      <span className="text-sm text-gray-400">{item.latestVersion}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.deviceCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastUpdate}</td>
                  <td className="px-4 py-3">
                    <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      item.status === 'up-to-date' 
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                    }`} disabled={item.status === 'up-to-date'}>
                      {item.status === 'up-to-date' ? '已是最新' : '立即更新'}
                    </button>
                  </td>
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