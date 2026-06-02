'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Download, Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface BaseVersion {
  id: string;
  name: string;
  type: string;
  currentVersion: string;
  releaseDate: string;
  description: string;
  status: 'active' | 'inactive' | 'deprecated';
  deviceCount: number;
}

const mockData: BaseVersion[] = [
  { id: 'BV-001', name: '标准病毒特征库', type: '安全特征', currentVersion: '2026.06.02', releaseDate: '2026-06-02', description: '包含最新病毒、木马、蠕虫等恶意软件特征', status: 'active', deviceCount: 45 },
  { id: 'BV-002', name: '威胁情报基准库', type: '威胁情报', currentVersion: '2026.06.01', releaseDate: '2026-06-01', description: '包含已知威胁IP、域名、URL等情报', status: 'active', deviceCount: 38 },
  { id: 'BV-003', name: '漏洞特征基准库', type: '漏洞特征', currentVersion: '2026.05.28', releaseDate: '2026-05-28', description: '包含CVE漏洞特征和POC检测规则', status: 'inactive', deviceCount: 22 },
  { id: 'BV-004', name: '恶意软件哈希库', type: '安全特征', currentVersion: '2026.06.02', releaseDate: '2026-06-02', description: '包含恶意软件MD5/SHA256哈希值', status: 'active', deviceCount: 52 },
  { id: 'BV-005', name: 'IP信誉基准库', type: '威胁情报', currentVersion: '2026.05.30', releaseDate: '2026-05-30', description: '包含恶意IP地址信誉评级', status: 'deprecated', deviceCount: 15 },
];

export function BaseVersionManage() {
  const [data] = useState<BaseVersion[]>(mockData);
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredData = data.filter(d =>
    !searchKeyword || d.name.toLowerCase().includes(searchKeyword.toLowerCase()) || d.type.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 inline mr-1" />活跃</span>;
    if (status === 'inactive') return <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400"><AlertTriangle className="w-3 h-3 inline mr-1" />待启用</span>;
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 inline mr-1" />已废弃</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">基准版本库管理</h2>
        <p className="text-sm text-gray-400 mt-1">管理和维护各类安全特征库的基准版本，支持版本导入导出</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索版本库名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A354D] hover:bg-[#3A456D] text-white rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              导入
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              添加版本库
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A354D]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">版本库名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">当前版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">发布日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">关联设备</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#2A354D] hover:bg-[#2A354D]/50">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-xs">{item.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-blue-400 font-medium">{item.currentVersion}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{item.releaseDate}</td>
                  <td className="px-4 py-3 text-sm text-white">{item.deviceCount} 台</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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