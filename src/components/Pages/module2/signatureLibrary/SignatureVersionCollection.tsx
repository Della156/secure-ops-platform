'use client';

import React, { useState } from 'react';
import { Search, Download, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, Database, Server } from 'lucide-react';

interface CollectionTask {
  id: string;
  deviceName: string;
  ip: string;
  libraryType: string;
  currentVersion: string;
  collectionTime: string;
  status: 'success' | 'failed' | 'in-progress';
  message: string;
}

const mockData: CollectionTask[] = [
  { id: 'COL-001', deviceName: '防火墙-FW-01', ip: '192.168.1.254', libraryType: '病毒特征库', currentVersion: '2026.06.02', collectionTime: '2026-06-02 08:00:00', status: 'success', message: '采集成功' },
  { id: 'COL-002', deviceName: '入侵检测-IDS-01', ip: '192.168.1.10', libraryType: '威胁情报库', currentVersion: '2026.06.02', collectionTime: '2026-06-02 08:05:00', status: 'success', message: '采集成功' },
  { id: 'COL-003', deviceName: 'WAF-01', ip: '192.168.1.20', libraryType: '规则库', currentVersion: '2026.06.01', collectionTime: '2026-06-02 08:10:00', status: 'success', message: '采集成功' },
  { id: 'COL-004', deviceName: '核心交换机-01', ip: '192.168.1.1', libraryType: '漏洞特征库', currentVersion: '-', collectionTime: '2026-06-02 08:15:00', status: 'failed', message: '连接超时' },
  { id: 'COL-005', deviceName: '日志服务器-01', ip: '192.168.2.50', libraryType: '恶意软件库', currentVersion: '-', collectionTime: '2026-06-02 08:20:00', status: 'in-progress', message: '采集中...' },
];

export function SignatureVersionCollection() {
  const [data] = useState<CollectionTask[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.deviceName.toLowerCase().includes(searchKeyword.toLowerCase()) || d.libraryType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    success: data.filter(d => d.status === 'success').length,
    failed: data.filter(d => d.status === 'failed').length,
    inProgress: data.filter(d => d.status === 'in-progress').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />成功</span>;
    if (status === 'failed') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />采集中</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">特征库版本采集</h2>
        <p className="text-sm text-gray-400 mt-1">从各安全设备采集特征库版本信息，支持定时和手动采集</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">采集任务总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">采集成功</p>
              <p className="text-xl font-semibold text-green-400">{stats.success}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">采集失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs">采集中</p>
              <p className="text-xl font-semibold text-blue-400">{stats.inProgress}</p>
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
              placeholder="搜索设备名称或特征库类型..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出采集结果
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              立即采集
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">设备名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">IP地址</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">特征库类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">采集时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">消息</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.deviceName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{item.ip}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.libraryType}</td>
                  <td className="px-4 py-3 text-sm text-blue-400">{item.currentVersion}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.collectionTime}
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.message}</td>
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