'use client';

import React, { useState } from 'react';
import { Search, Lock, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface EncryptionItem {
  id: string;
  database: string;
  encryptionType: string;
  status: 'enabled' | 'disabled' | 'partial';
  algorithm: string;
  keyLength: string;
  lastRotation: string;
  nextRotation: string;
}

const mockData: EncryptionItem[] = [
  { id: 'ENC-001', database: 'MySQL-Prod', encryptionType: '数据存储加密', status: 'enabled', algorithm: 'AES-256', keyLength: '256位', lastRotation: '2026-05-01', nextRotation: '2026-08-01' },
  { id: 'ENC-002', database: 'MySQL-Prod', encryptionType: '传输加密', status: 'enabled', algorithm: 'TLS 1.3', keyLength: '256位', lastRotation: '2026-05-15', nextRotation: '2026-11-15' },
  { id: 'ENC-003', database: 'PostgreSQL-Prod', encryptionType: '数据存储加密', status: 'enabled', algorithm: 'AES-256', keyLength: '256位', lastRotation: '2026-04-01', nextRotation: '2026-07-01' },
  { id: 'ENC-004', database: 'PostgreSQL-Prod', encryptionType: '传输加密', status: 'partial', algorithm: 'TLS 1.2', keyLength: '128位', lastRotation: '2026-03-01', nextRotation: '2026-09-01' },
  { id: 'ENC-005', database: 'Oracle-Dev', encryptionType: '数据存储加密', status: 'disabled', algorithm: '-', keyLength: '-', lastRotation: '-', nextRotation: '-' },
  { id: 'ENC-006', database: 'SQLServer-Staging', encryptionType: '传输加密', status: 'disabled', algorithm: '-', keyLength: '-', lastRotation: '-', nextRotation: '-' },
];

export function DataEncryptionCheck() {
  const [data] = useState<EncryptionItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.database.toLowerCase().includes(searchKeyword.toLowerCase()) || d.encryptionType.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    enabled: data.filter(d => d.status === 'enabled').length,
    partial: data.filter(d => d.status === 'partial').length,
    disabled: data.filter(d => d.status === 'disabled').length,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'enabled') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">已启用</span>;
    if (status === 'partial') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">部分启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">未启用</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">数据存储与传输加密检查</h2>
        <p className="text-sm text-gray-400 mt-1">检查数据库数据存储和传输的加密配置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">加密项总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">已启用</p>
              <p className="text-xl font-semibold text-green-400">{stats.enabled}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-xs">部分启用</p>
              <p className="text-xl font-semibold text-yellow-400">{stats.partial}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">未启用</p>
              <p className="text-xl font-semibold text-red-400">{stats.disabled}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">数据库</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">加密类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">算法</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">密钥长度</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">上次轮换</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">下次轮换</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{item.database}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{item.encryptionType}</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.algorithm}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.keyLength}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.lastRotation}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.nextRotation}</td>
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