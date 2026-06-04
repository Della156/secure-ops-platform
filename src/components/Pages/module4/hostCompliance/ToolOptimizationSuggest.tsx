'use client';

import React, { useState } from 'react';
import { Search, Filter, Lightbulb, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const suggestions = [
  { id: 'sug-001', tool: 'HIDS', level: 'high', title: '规则更新建议', description: '检测到有15条规则需要更新以提高检测准确性', asset: 'web-server-01', status: 'pending' },
  { id: 'sug-002', tool: 'EPP', level: 'medium', title: '策略优化建议', description: '建议调整恶意软件检测阈值以减少误报', asset: 'db-server-01', status: 'pending' },
  { id: 'sug-003', tool: 'FIM', level: 'high', title: '覆盖率提升', description: '发现3台主机未安装文件完整性监控代理', asset: 'app-server-03', status: 'pending' },
  { id: 'sug-004', tool: 'NTA', level: 'low', title: '规则优化', description: '建议增加新的威胁检测规则', asset: 'network-01', status: 'pending' },
  { id: 'sug-005', tool: 'VS', level: 'critical', title: '漏洞扫描器离线', description: '漏洞扫描器已离线超过48小时，需立即处理', asset: 'scan-server-01', status: 'pending' },
];

const levelConfig = {
  critical: { label: '紧急', color: 'bg-red-500/20 text-red-400', icon: AlertTriangle },
  high: { label: '高', color: 'bg-orange-500/20 text-orange-400', icon: AlertTriangle },
  medium: { label: '中', color: 'bg-yellow-500/20 text-yellow-400', icon: Zap },
  low: { label: '低', color: 'bg-blue-500/20 text-blue-400', icon: Lightbulb },
};

const IconComponent = ({ icon: Icon }) => <Icon className="w-5 h-5" />;

export function ToolOptimizationSuggest() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const filteredSuggestions = suggestions.filter(sug => {
    if (search && !sug.title.includes(search) && !sug.tool.includes(search)) return false;
    if (levelFilter && sug.level !== levelFilter) return false;
    return true;
  });

  const stats = {
    total: suggestions.length,
    critical: suggestions.filter(s => s.level === 'critical').length,
    high: suggestions.filter(s => s.level === 'high').length,
    medium: suggestions.filter(s => s.level === 'medium').length,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="工具优化建议" description="基于数据分析提供主机安全工具优化建议"
        actions={[
          { icon: RefreshCw, label: '重新分析', onClick: () => {} },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-[#0066FF]" />
            <span className="text-sm text-[#9CA3AF]">建议总数</span>
          </div>
          <div className="text-2xl font-semibold text-[#F3F4F6]">{stats.total}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <span className="text-sm text-[#9CA3AF]">紧急</span>
          </div>
          <div className="text-2xl font-semibold text-[#EF4444]">{stats.critical}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-sm text-[#9CA3AF]">高优先级</span>
          </div>
          <div className="text-2xl font-semibold text-[#F59E0B]">{stats.high}</div>
        </div>
        <div className="p-4 bg-[#0D1117] rounded-xl border border-[#2A354D]">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#EAB308]" />
            <span className="text-sm text-[#9CA3AF]">中等优先级</span>
          </div>
          <div className="text-2xl font-semibold text-[#EAB308]">{stats.medium}</div>
        </div>
      </div>

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
                placeholder="搜索建议"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            >
              <option value="">全部优先级</option>
              <option value="critical">紧急</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredSuggestions.map(sug => {
            const config = levelConfig[sug.level];
            const Icon = config.icon;
            return (
              <div key={sug.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-[#181F32]">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <IconComponent icon={Icon} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">{sug.tool}</span>
                    </div>
                    <div className="font-medium text-[#F3F4F6] mb-1">{sug.title}</div>
                    <div className="text-sm text-[#9CA3AF]">{sug.description}</div>
                    <div className="text-xs text-[#6E7681] mt-1">关联资产: {sug.asset}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-[#0066FF] text-white text-sm rounded-lg hover:bg-[#0052CC] transition-colors flex items-center gap-1">
                    <span>应用建议</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-[#181F32] text-[#F3F4F6] text-sm border border-[#2A354D] rounded-lg hover:bg-[#21262D] transition-colors flex items-center gap-1">
                    <span>忽略</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}