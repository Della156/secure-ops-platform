'use client';

import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Shield, Key, Clock, Eye } from 'lucide-react';

interface ComplianceItem {
  id: string;
  account: string;
  status: 'compliant' | 'non-compliant';
  issues: string[];
  lastChange: string;
  expiresIn: string;
  complexity: 'weak' | 'medium' | 'strong';
}

const mockData: ComplianceItem[] = [
  { id: 'PC-001', account: 'admin', status: 'compliant', issues: [], lastChange: '2026-05-15', expiresIn: '15天', complexity: 'strong' },
  { id: 'PC-002', account: 'user001', status: 'non-compliant', issues: ['密码长度不足', '缺少特殊字符'], lastChange: '2026-03-20', expiresIn: '已过期', complexity: 'weak' },
  { id: 'PC-003', account: 'user002', status: 'non-compliant', issues: ['密码过期'], lastChange: '2026-04-01', expiresIn: '已过期', complexity: 'medium' },
  { id: 'PC-004', account: 'user003', status: 'compliant', issues: [], lastChange: '2026-05-20', expiresIn: '10天', complexity: 'strong' },
  { id: 'PC-005', account: 'user004', status: 'non-compliant', issues: ['弱口令检测'], lastChange: '2026-05-10', expiresIn: '20天', complexity: 'weak' },
];

export function PwdComplianceCheck() {
  const [data] = useState<ComplianceItem[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const filteredData = data.filter(item =>
    !searchKeyword || item.account.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const stats = {
    total: data.length,
    compliant: data.filter(d => d.status === 'compliant').length,
    nonCompliant: data.filter(d => d.status === 'non-compliant').length,
    compliantRate: Math.round(data.filter(d => d.status === 'compliant').length / data.length * 100),
  };

  const getComplexityBadge = (complexity: string) => {
    if (complexity === 'strong') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">强</span>;
    if (complexity === 'medium') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">中</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">弱</span>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'compliant') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />合规</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />不合规</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">密码合规性检查</h2>
        <p className="text-sm text-gray-400 mt-1">自动检查账号密码复杂度、有效期、是否弱口令，不合规账号列表展示，不合规详情查看</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
          <p className="text-gray-400 text-sm">账号总数</p>
          <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#1E2736] border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-gray-400 text-xs">合规</p>
              <p className="text-xl font-semibold text-green-400">{stats.compliant}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E2736] border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-gray-400 text-xs">不合规</p>
              <p className="text-xl font-semibold text-red-400">{stats.nonCompliant}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">账号列表</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索账号..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10 pr-4 py-1.5 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-[#2A354D]">
            {filteredData.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 cursor-pointer hover:bg-[#2A354D]/50 transition-colors ${selectedItem?.id === item.id ? 'bg-[#2A354D]/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.account}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        {getComplexityBadge(item.complexity)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.expiresIn}
                      </span>
                    </div>
                  </div>
                  {item.status === 'non-compliant' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
          <div className="p-4 border-b border-[#2A354D]">
            <h3 className="text-sm font-medium text-gray-300">不合规详情</h3>
          </div>
          <div className="p-4">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{selectedItem.account}</span>
                  {getStatusBadge(selectedItem.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">上次修改</p>
                    <p className="text-sm text-gray-300">{selectedItem.lastChange}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">有效期</p>
                    <p className={`text-sm ${selectedItem.expiresIn === '已过期' ? 'text-red-400' : 'text-gray-300'}`}>{selectedItem.expiresIn}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">密码强度</p>
                  <div className="flex items-center gap-2">
                    {getComplexityBadge(selectedItem.complexity)}
                    <span className="text-sm text-gray-400">
                      {selectedItem.complexity === 'strong' ? '强密码' : selectedItem.complexity === 'medium' ? '中等强度' : '弱口令'}
                    </span>
                  </div>
                </div>

                {selectedItem.issues.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">不合规项</p>
                    <div className="space-y-2">
                      {selectedItem.issues.map((issue, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-red-400">
                          <XCircle className="w-4 h-4" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.status === 'non-compliant' && (
                  <div className="pt-4 border-t border-[#2A354D]">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      <Key className="w-4 h-4" />
                      重置密码
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Eye className="w-12 h-12 mb-4 opacity-50" />
                <p>请选择账号查看详情</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}