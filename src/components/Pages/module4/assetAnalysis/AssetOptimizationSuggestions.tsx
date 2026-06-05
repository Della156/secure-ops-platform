'use client';
import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Lightbulb, ArrowRight, CheckCircle2, Clock, Server, Database, Shield } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const suggestions = [
  { id: 'SUGG-001', assetId: 'ASSET-002', assetName: 'db-server-01', type: '资源优化', priority: 'high', suggestion: 'CPU使用率持续超过90%，建议增加CPU资源或迁移部分负载', estimatedImpact: '性能提升40%', status: 'pending' },
  { id: 'SUGG-002', assetId: 'ASSET-004', assetName: 'cdn-node-01', type: '配置优化', priority: 'medium', suggestion: '网络带宽使用率95%，建议升级带宽或增加CDN节点', estimatedImpact: '性能提升25%', status: 'pending' },
  { id: 'SUGG-003', assetId: 'ASSET-001', assetName: 'web-server-01', type: '安全优化', priority: 'high', suggestion: '检测到高危漏洞CVE-2024-xxxx，建议立即更新补丁', estimatedImpact: '风险降低80%', status: 'processing' },
  { id: 'SUGG-004', assetId: 'ASSET-003', assetName: 'api-gateway-01', type: '资源优化', priority: 'low', suggestion: '资源利用率较低(CPU 45%)，建议考虑资源整合', estimatedImpact: '成本降低15%', status: 'completed' },
];

const priorityColors: Record<string, string> = {
  'high': 'bg-red-500/20 text-red-400',
  'medium': 'bg-yellow-500/20 text-yellow-400',
  'low': 'bg-blue-500/20 text-blue-400',
};

const statusColors: Record<string, string> = {
  'pending': 'bg-gray-500/20 text-gray-400',
  'processing': 'bg-blue-500/20 text-blue-400',
  'completed': 'bg-green-500/20 text-green-400',
};

const typeIcons: Record<string, any> = {
  '资源优化': Server,
  '配置优化': Database,
  '安全优化': Shield,
};

const typeColors: Record<string, string> = {
  '资源优化': 'bg-blue-500/20 text-blue-400',
  '配置优化': 'bg-green-500/20 text-green-400',
  '安全优化': 'bg-red-500/20 text-red-400',
};

export function AssetOptimizationSuggestions() {
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (priorityFilter && suggestion.priority !== priorityFilter) return false;
    return true;
  });

  const handleApply = (suggestionId: string) => {
    alert(`应用优化建议 ${suggestionId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产优化建议" description="查看和应用资产优化建议"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新建议
          </button>,
        ]}
      />

      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-slate-500" />
        <select
          value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
        >
          <option value="">全部优先级</option>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredSuggestions.map(suggestion => {
          const TypeIcon = typeIcons[suggestion.type] || Lightbulb;
          return (
            <div key={suggestion.id} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{suggestion.assetName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${typeColors[suggestion.type as keyof typeof typeColors]}`}>
                        <TypeIcon className="w-3 h-3 inline" /> {suggestion.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[suggestion.priority as keyof typeof priorityColors]}`}>
                        {suggestion.priority === 'high' ? '高优先级' : suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColors[suggestion.status as keyof typeof statusColors]}`}>
                        {suggestion.status === 'pending' ? '待处理' : suggestion.status === 'processing' ? '处理中' : '已完成'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{suggestion.assetId}</div>
                  </div>
                </div>
              </div>
              <div className="ml-12 space-y-2">
                <div className="text-sm text-slate-300">{suggestion.suggestion}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-green-400">
                    <ArrowRight className="w-3 h-3 inline" /> 预计影响: {suggestion.estimatedImpact}
                  </div>
                  {suggestion.status !== 'completed' && (
                    <button onClick={() => handleApply(suggestion.id)} className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg">
                      <CheckCircle2 className="w-3 h-3" /> 应用建议
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AssetOptimizationSuggestions;