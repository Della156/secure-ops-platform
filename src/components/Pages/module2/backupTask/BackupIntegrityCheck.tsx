'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, FileCheck, Hash, Clock, Search, Download } from 'lucide-react';

interface CheckItem {
  id: string;
  backupName: string;
  target: string;
  checkType: string;
  status: 'pass' | 'fail' | 'pending';
  checkTime: string;
  md5Value: string;
  expectedMd5: string;
  result: string;
}

const mockData: CheckItem[] = [
  { id: 'CHK-001', backupName: '数据库全量备份_20260602', target: 'prod-db', checkType: 'MD5校验', status: 'pass', checkTime: '2026-06-02 02:35:00', md5Value: 'a1b2c3d4e5f6', expectedMd5: 'a1b2c3d4e5f6', result: '校验通过' },
  { id: 'CHK-002', backupName: '日志文件备份_20260602', target: 'log-server', checkType: 'MD5校验', status: 'pass', checkTime: '2026-06-02 03:20:00', md5Value: 'f6e5d4c3b2a1', expectedMd5: 'f6e5d4c3b2a1', result: '校验通过' },
  { id: 'CHK-003', backupName: '配置文件备份_20260602', target: 'config-server', checkType: 'MD5校验', status: 'pending', checkTime: '-', md5Value: '-', expectedMd5: '-', result: '等待校验' },
  { id: 'CHK-004', backupName: '用户数据备份_20260602', target: 'user-db', checkType: 'MD5校验', status: 'fail', checkTime: '2026-06-02 01:15:00', md5Value: 'x1y2z3w4v5u6', expectedMd5: 'a1b2c3d4e5f6', result: 'MD5值不匹配' },
];

export function BackupIntegrityCheck() {
  const [data] = useState<CheckItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(item =>
    !searchKeyword || 
    item.backupName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    item.target.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    pass: data.filter(d => d.status === 'pass').length,
    fail: data.filter(d => d.status === 'fail').length,
    pending: data.filter(d => d.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pass') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />通过</span>;
    if (status === 'fail') return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />失败</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400"><Clock className="w-3 h-3 inline mr-1" />待校验</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">备份完整性校验</h2>
        <p className="text-sm text-gray-400 mt-1">备份完成后自动进行完整性校验（如MD5校验），校验结果记录</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">校验总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">通过</p>
              <p className="text-xl font-semibold text-green-400">{stats.pass}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">失败</p>
              <p className="text-xl font-semibold text-red-400">{stats.fail}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-gray-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-gray-400 text-xs">待校验</p>
              <p className="text-xl font-semibold text-gray-400">{stats.pending}</p>
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
              placeholder="搜索备份名称或目标..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出校验记录
          </button>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">备份名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">目标</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">校验方式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">校验时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">校验结果</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3 text-sm text-white font-medium">{item.backupName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.target}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">{item.checkType}</span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.checkTime}</td>
                  <td className={`px-4 py-3 text-sm ${item.status === 'pass' ? 'text-green-400' : item.status === 'fail' ? 'text-red-400' : 'text-gray-400'}`}>
                    {item.result}
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