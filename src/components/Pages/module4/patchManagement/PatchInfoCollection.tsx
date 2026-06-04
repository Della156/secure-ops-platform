'use client';
import React, { useState } from 'react';
import { Search, Filter, Plus, RefreshCw, Database, Server, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const sources = [
  { id: 'src-001', name: 'Microsoft Update Catalog', type: '官方源', status: 'active', lastSync: '2026-06-03 08:00', count: 156 },
  { id: 'src-002', name: 'Red Hat Network', type: '官方源', status: 'active', lastSync: '2026-06-03 07:30', count: 89 },
  { id: 'src-003', name: 'Debian Security', type: '官方源', status: 'active', lastSync: '2026-06-03 07:00', count: 234 },
  { id: 'src-004', name: 'Ubuntu Security', type: '官方源', status: 'active', lastSync: '2026-06-03 06:30', count: 198 },
  { id: 'src-005', name: 'Oracle Support', type: '官方源', status: 'inactive', lastSync: '2026-05-28 10:00', count: 45 },
];

const statusConfig = {
  active: { label: '活跃', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  inactive: { label: '停用', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
  error: { label: '错误', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-3 h-3" />;

export function PatchInfoCollection() {
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const filteredSources = sources.filter(src => {
    if (search && !src.name.includes(search) && !src.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁信息收集" description="管理补丁信息来源和收集任务"
        actions={[
          { icon: RefreshCw, label: '同步', onClick: () => {} },
          { icon: Plus, label: '添加源', onClick: () => {} },
        ]}
      />

      <div className="bg-[#0D1117] rounded-xl border border-[#2A354D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#2A354D]">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] placeholder-[#6E7681] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                placeholder="搜索源名称或ID"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
            <Database className="w-4 h-4" />
            <span>已收集 {sources.reduce((sum, s) => sum + s.count, 0)} 个补丁</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
          {filteredSources.map(source => {
            const config = statusConfig[source.status];
            const Icon = config.icon;
            return (
              <div
                key={source.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSource === source.id
                    ? 'border-[#0066FF] bg-[#181F32]'
                    : 'border-[#2A354D] bg-[#161B22] hover:border-[#3A4553]'
                }`}
                onClick={() => setSelectedSource(source.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#0066FF]" />
                    <span className="font-medium text-[#F3F4F6]">{source.name}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${config.color}`}>
                    <IconComponent icon={Icon} />
                    {config.label}
                  </span>
                </div>
              <div className="text-sm text-[#9CA3AF] mb-2">类型: {source.type}</div>
              <div className="text-sm text-[#9CA3AF] mb-2">最后同步: {source.lastSync}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#0066FF]">{source.count} 个补丁</span>
                <ArrowRight className="w-4 h-4 text-[#6E7681]" />
              </div>
            </div>
            );
          })}
        </div>

        {selectedSource && (
          <div className="p-4 border-t border-[#2A354D]">
            <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">源详情: {sources.find(s => s.id === selectedSource)?.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-[#181F32] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">源类型</div>
                <div className="text-lg font-semibold text-[#F3F4F6]">官方源</div>
              </div>
              <div className="p-3 bg-[#181F32] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">补丁数量</div>
                <div className="text-lg font-semibold text-[#00D4AA]">{sources.find(s => s.id === selectedSource)?.count}</div>
              </div>
              <div className="p-3 bg-[#181F32] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">最后同步</div>
                <div className="text-lg font-semibold text-[#F3F4F6]">{sources.find(s => s.id === selectedSource)?.lastSync}</div>
              </div>
              <div className="p-3 bg-[#181F32] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">状态</div>
                <div className="text-lg font-semibold text-[#00D4AA]">活跃</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors">同步补丁</button>
              <button className="px-4 py-2 bg-[#181F32] text-[#F3F4F6] border border-[#2A354D] rounded-lg hover:bg-[#21262D] transition-colors">编辑配置</button>
              <button className="px-4 py-2 bg-[#181F32] text-[#F3F4F6] border border-[#2A354D] rounded-lg hover:bg-[#21262D] transition-colors">查看补丁列表</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}