'use client';

import React, { useState, useMemo } from 'react';
import {
  Lightbulb, Search, Filter, Download, RefreshCw,
  TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  ArrowRight, ChevronDown, ChevronRight, Zap,
  Clock, Server, Database, Shield, Bug
} from 'lucide-react';

interface OptimizationSuggestion {
  id: string;
  taskName: string;
  taskId: string;
  category: string;
  type: 'performance' | 'security' | 'reliability' | 'efficiency';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
  estimatedGain: string;
  status: 'pending' | 'implemented' | 'reviewing';
  relatedTask?: string;
}

interface OptimizationStats {
  total: number;
  implemented: number;
  pending: number;
  avgGain: string;
}

const mockSuggestions: OptimizationSuggestion[] = [
  { id: 'OPT-001', taskName: '漏洞扫描任务', taskId: 'TSK-002', category: '扫描', type: 'performance', priority: 'high', suggestion: '优化扫描策略，减少重复扫描目标，预计提升扫描效率 35%', impact: '高', estimatedGain: '35%', status: 'pending', relatedTask: '漏洞扫描优化' },
  { id: 'OPT-002', taskName: '日志备份', taskId: 'TSK-003', category: '备份', type: 'reliability', priority: 'high', suggestion: '增加磁盘空间监控告警，避免备份任务因空间不足失败', impact: '高', estimatedGain: '99.9%', status: 'implemented', relatedTask: '磁盘监控告警' },
  { id: 'OPT-003', taskName: '基线检查', taskId: 'TSK-004', category: '合规', type: 'security', priority: 'medium', suggestion: '更新账户权限策略，使用临时权限机制提高安全性', impact: '中', estimatedGain: '安全性提升', status: 'reviewing', relatedTask: '权限策略优化' },
  { id: 'OPT-004', taskName: '告警聚合', taskId: 'TSK-005', category: '分析', type: 'efficiency', priority: 'medium', suggestion: '引入智能去重算法，减少重复告警 60%', impact: '中', estimatedGain: '60%', status: 'pending', relatedTask: '告警去重优化' },
  { id: 'OPT-005', taskName: '威胁情报同步', taskId: 'TSK-006', category: '同步', type: 'reliability', priority: 'high', suggestion: '增加API调用重试机制和熔断保护，提高同步稳定性', impact: '高', estimatedGain: '可用性 99.5%', status: 'pending', relatedTask: 'API熔断保护' },
  { id: 'OPT-006', taskName: '安全策略巡检', taskId: 'TSK-001', category: '巡检', type: 'performance', priority: 'low', suggestion: '优化并行执行策略，提升巡检速度', impact: '低', estimatedGain: '20%', status: 'implemented', relatedTask: '并行执行优化' },
];

function TypeIcon({ type }: { type: OptimizationSuggestion['type'] }) {
  const icons = {
    performance: <Zap className="w-4 h-4 text-yellow-400" />,
    security: <Shield className="w-4 h-4 text-blue-400" />,
    reliability: <Database className="w-4 h-4 text-green-400" />,
    efficiency: <TrendingUp className="w-4 h-4 text-purple-400" />,
  };
  return icons[type];
}

function TypeBadge({ type }: { type: OptimizationSuggestion['type'] }) {
  const config = {
    performance: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '性能优化' },
    security: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '安全优化' },
    reliability: { bg: 'bg-green-500/10', text: 'text-green-400', label: '可靠性' },
    efficiency: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: '效率提升' },
  };
  const { bg, text, label } = config[type];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: OptimizationSuggestion['priority'] }) {
  const config = {
    high: { bg: 'bg-red-500/10', text: 'text-red-400', label: '高优先级' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中优先级' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '低优先级' },
  };
  const { bg, text, label } = config[priority];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: OptimizationSuggestion['status'] }) {
  const config = {
    pending: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '待实施' },
    implemented: { bg: 'bg-green-500/10', text: 'text-green-400', label: '已实施' },
    reviewing: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '评审中' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

export function OptimizationSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const filteredSuggestions = useMemo(() => {
    return mockSuggestions.filter(suggestion => {
      const matchSearch = suggestion.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.suggestion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'all' || suggestion.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [searchTerm, typeFilter]);

  const stats = useMemo(() => {
    const total = mockSuggestions.length;
    const implemented = mockSuggestions.filter(s => s.status === 'implemented').length;
    const pending = mockSuggestions.filter(s => s.status === 'pending').length;
    const avgGain = '32%';
    return { total, implemented, pending, avgGain };
  }, []);

  const types = ['all', 'performance', 'security', 'reliability', 'efficiency'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            自动任务优化分析建议
          </h2>
          <p className="text-sm text-gray-400 mt-1">基于历史数据分析，提供自动化任务优化建议</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新建议
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '优化建议总数', value: stats.total, icon: <Lightbulb className="w-4 h-4" />, color: 'yellow' },
          { label: '已实施', value: stats.implemented, icon: <CheckCircle2 className="w-4 h-4" />, color: 'green' },
          { label: '待实施', value: stats.pending, icon: <Clock className="w-4 h-4" />, color: 'orange' },
          { label: '平均收益', value: stats.avgGain, icon: <TrendingUp className="w-4 h-4" />, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索任务名称、建议内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? '全部类型' :
                     type === 'performance' ? '性能优化' :
                     type === 'security' ? '安全优化' :
                     type === 'reliability' ? '可靠性' : '效率提升'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id}>
              <div className="p-4 hover:bg-[#111625] cursor-pointer" onClick={() => setExpandedSuggestion(expandedSuggestion === suggestion.id ? null : suggestion.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      suggestion.priority === 'high' ? 'bg-red-500/20' :
                      suggestion.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      <TypeIcon type={suggestion.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{suggestion.taskName}</span>
                        <span className="text-xs text-gray-500 font-mono">{suggestion.id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <TypeBadge type={suggestion.type} />
                        <PriorityBadge priority={suggestion.priority} />
                        <span className="text-xs text-gray-500">{suggestion.category}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-300 line-clamp-2">{suggestion.suggestion}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={suggestion.status} />
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500">预期收益:</span>
                      <span className="text-green-400 font-medium">{suggestion.estimatedGain}</span>
                    </div>
                    {expandedSuggestion === suggestion.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {expandedSuggestion === suggestion.id && (
                <div className="bg-[#111625] px-4 py-3 border-t border-[#2A354D]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-gray-500">影响级别</span>
                      <div className={`text-sm mt-1 font-medium ${
                        suggestion.impact === '高' ? 'text-red-400' :
                        suggestion.impact === '中' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>
                        {suggestion.impact === '高' ? '高' : suggestion.impact === '中' ? '中' : '低'}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">相关任务</span>
                      <div className="text-sm text-white mt-1">{suggestion.relatedTask || '-'}</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">任务ID</span>
                      <div className="text-sm text-white font-mono mt-1">{suggestion.taskId}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1">
                      查看详情 <ArrowRight className="w-3 h-3" />
                    </button>
                    {suggestion.status === 'pending' && (
                      <button className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded">
                        立即实施
                      </button>
                    )}
                    <button className="px-3 py-1.5 text-xs bg-[#20293F] hover:bg-[#2A354D] text-gray-300 rounded">
                      标记为已阅读
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredSuggestions.length} 条建议</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-white">优化建议提示</h3>
            <p className="text-xs text-gray-400 mt-1">
              根据系统分析，当前有 <span className="text-yellow-400 font-medium">{stats.pending}</span> 条待实施的优化建议。
              建议优先处理高优先级的性能和可靠性优化，预计可提升整体任务执行效率 <span className="text-green-400 font-medium">{stats.avgGain}</span>。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptimizationSuggestions;