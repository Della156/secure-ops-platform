'use client';
import React, { useState } from 'react';
import { Search, Plus, Eye, Download, Trash2, Tag, Calendar, User, GitBranch } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const versions = [
  { id: 'VER-001', baseline: '操作系统安全基线', version: 'v2.1.0', status: 'active', createdBy: 'admin', createdAt: '2026-06-01', changes: '优化密码策略规则' },
  { id: 'VER-002', baseline: '操作系统安全基线', version: 'v2.0.0', status: 'archived', createdBy: 'admin', createdAt: '2026-05-15', changes: '更新安全补丁检查规则' },
  { id: 'VER-003', baseline: '操作系统安全基线', version: 'v1.9.0', status: 'archived', createdBy: 'admin', createdAt: '2026-04-01', changes: '新增日志审计规则' },
  { id: 'VER-004', baseline: '数据库安全基线', version: 'v1.5.0', status: 'active', createdBy: 'user1', createdAt: '2026-06-02', changes: '优化权限检查规则' },
];

export function BaselineVersionManagement() {
  const [search, setSearch] = useState('');

  const filteredVersions = versions.filter(version => {
    if (search && !version.baseline.includes(search) && !version.version.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线版本管理" description="管理基线版本历史"
        actions={[
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 创建新版本
          </button>,
        ]}
      />

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text" placeholder="搜索基线或版本..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVersions.map(version => (
          <div key={version.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{version.baseline}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${version.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {version.status === 'active' ? '当前版本' : '已归档'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Tag className="w-3 h-3" />{version.version}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-gray-400 hover:text-blue-400">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-green-400">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-slate-300">{version.changes}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />{version.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{version.createdAt}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BaselineVersionManagement;