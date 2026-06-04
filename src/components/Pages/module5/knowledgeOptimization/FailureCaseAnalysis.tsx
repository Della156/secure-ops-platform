'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertCircle, Search, Filter, Download, Calendar,
  XCircle, ChevronDown, ChevronRight, Tag, User,
  Clock, FileText, Link2, RefreshCw, TrendingUp,
  BarChart3, Bug, Shield, Database
} from 'lucide-react';

interface FailureCase {
  id: string;
  taskName: string;
  taskId: string;
  failureType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  duration: string;
  affectedAsset: string;
  rootCause: string;
  status: 'analyzing' | 'resolved' | 'pending';
  analyzer: string;
}

interface FailureTypeStat {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

const mockFailureCases: FailureCase[] = [
  { id: 'FC-001', taskName: '漏洞扫描任务', taskId: 'TSK-002', failureType: '连接超时', severity: 'critical', timestamp: '2026-06-02 16:45:23', duration: '15分钟', affectedAsset: 'WEB-APP-12', rootCause: '目标服务器网络不通', status: 'analyzing', analyzer: '张工' },
  { id: 'FC-002', taskName: '基线检查', taskId: 'TSK-004', failureType: '权限不足', severity: 'high', timestamp: '2026-06-02 14:30:12', duration: '8分钟', affectedAsset: 'DB-MASTER-01', rootCause: '执行账户权限过期', status: 'resolved', analyzer: '李工' },
  { id: 'FC-003', taskName: '威胁情报同步', taskId: 'TSK-006', failureType: 'API调用失败', severity: 'medium', timestamp: '2026-06-02 13:20:45', duration: '3分钟', affectedAsset: 'TI-PLATFORM', rootCause: '第三方API限流', status: 'pending', analyzer: '王工' },
  { id: 'FC-004', taskName: '日志备份', taskId: 'TSK-003', failureType: '磁盘空间不足', severity: 'high', timestamp: '2026-06-01 22:15:30', duration: '2分钟', affectedAsset: 'LOG-SERVER-01', rootCause: '磁盘使用率达98%', status: 'resolved', analyzer: '张工' },
  { id: 'FC-005', taskName: '安全策略巡检', taskId: 'TSK-001', failureType: '超时', severity: 'medium', timestamp: '2026-06-01 10:00:18', duration: '30分钟', affectedAsset: 'FW-EDGE-01', rootCause: '设备响应缓慢', status: 'analyzing', analyzer: '赵工' },
];

const mockFailureStats: FailureTypeStat[] = [
  { type: '连接超时', count: 23, percentage: 35, color: '#EF4444' },
  { type: '权限不足', count: 15, percentage: 23, color: '#F59E0B' },
  { type: 'API调用失败', count: 12, percentage: 18, color: '#3B82F6' },
  { type: '磁盘空间不足', count: 8, percentage: 12, color: '#8B5CF6' },
  { type: '超时', count: 8, percentage: 12, color: '#EC4899' },
];

function SeverityBadge({ severity }: { severity: FailureCase['severity'] }) {
  const config = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', label: '严重' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: '高' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '中' },
    low: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '低' },
  };
  const { bg, text, label } = config[severity];
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: FailureCase['status'] }) {
  const config = {
    analyzing: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '分析中' },
    resolved: { bg: 'bg-green-500/10', text: 'text-green-400', label: '已解决' },
    pending: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '待处理' },
  };
  const { bg, text, label } = config[status];
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${bg} ${text}`}>
      {label}
    </span>
  );
}

function FailureTrendChart() {
  const data = [
    { day: '周一', failures: 12 },
    { day: '周二', failures: 8 },
    { day: '周三', failures: 15 },
    { day: '周四', failures: 6 },
    { day: '周五', failures: 9 },
    { day: '周六', failures: 4 },
    { day: '周日', failures: 3 },
  ];
  const maxVal = Math.max(...data.map(d => d.failures));

  return (
    <div className="flex items-end justify-between h-32 gap-2">
      {data.map((d, i) => {
        const height = (d.failures / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t bg-gradient-to-t from-red-500/50 to-red-500/20 transition-all hover:from-red-500/70 hover:to-red-500/40"
              style={{ height: `${height}%`, minHeight: '8px' }}
            />
            <span className="text-xs text-gray-500 mt-2">{d.day}</span>
            <span className="text-xs text-white font-medium">{d.failures}</span>
          </div>
        );
      })}
    </div>
  );
}

export function FailureCaseAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    return mockFailureCases.filter(caseItem => {
      const matchSearch = caseItem.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.affectedAsset.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSeverity = severityFilter === 'all' || caseItem.severity === severityFilter;
      return matchSearch && matchSeverity;
    });
  }, [searchTerm, severityFilter]);

  const stats = useMemo(() => {
    const total = mockFailureCases.length;
    const analyzing = mockFailureCases.filter(c => c.status === 'analyzing').length;
    const resolved = mockFailureCases.filter(c => c.status === 'resolved').length;
    const critical = mockFailureCases.filter(c => c.severity === 'critical').length;
    return { total, analyzing, resolved, critical };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            任务失败案例分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">分析自动化任务失败案例，定位问题根因，提供优化建议</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '失败案例总数', value: stats.total, icon: <XCircle className="w-4 h-4" />, color: 'red' },
          { label: '分析中', value: stats.analyzing, icon: <Clock className="w-4 h-4" />, color: 'yellow' },
          { label: '已解决', value: stats.resolved, icon: <Shield className="w-4 h-4" />, color: 'green' },
          { label: '严重级别', value: stats.critical, icon: <Bug className="w-4 h-4" />, color: 'orange' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-400" />
            本周失败趋势
          </h3>
          <FailureTrendChart />
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            失败类型分布
          </h3>
          <div className="space-y-2">
            {mockFailureStats.map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{stat.type}</span>
                  <span className="text-white">{stat.count} ({stat.percentage}%)</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索任务名称、案例ID或影响资产..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="all">全部级别</option>
                <option value="critical">严重</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#2A354D]">
          {filteredCases.map((caseItem) => (
            <div key={caseItem.id}>
              <div className="p-4 hover:bg-[#111625] cursor-pointer" onClick={() => setExpandedCase(expandedCase === caseItem.id ? null : caseItem.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      caseItem.severity === 'critical' ? 'bg-red-500/20' :
                      caseItem.severity === 'high' ? 'bg-orange-500/20' :
                      caseItem.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Bug className={`w-5 h-5 ${
                        caseItem.severity === 'critical' ? 'text-red-400' :
                        caseItem.severity === 'high' ? 'text-orange-400' :
                        caseItem.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{caseItem.taskName}</span>
                        <span className="text-xs text-gray-500 font-mono">{caseItem.id}</span>
                        <SeverityBadge severity={caseItem.severity} />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {caseItem.failureType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          {caseItem.affectedAsset}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={caseItem.status} />
                    {expandedCase === caseItem.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              {expandedCase === caseItem.id && (
                <div className="bg-[#111625] px-4 py-3 border-t border-[#2A354D]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">失败时间</span>
                      <div className="text-white mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {caseItem.timestamp}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">持续时间</span>
                      <div className="text-white mt-1">{caseItem.duration}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">根因分析</span>
                      <div className="text-white mt-1">{caseItem.rootCause}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">分析人</span>
                      <div className="text-white mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {caseItem.analyzer}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded">查看详情</button>
                    <button className="px-3 py-1.5 text-xs bg-[#20293F] hover:bg-[#2A354D] text-gray-300 rounded">关联知识</button>
                    <button className="px-3 py-1.5 text-xs bg-[#20293F] hover:bg-[#2A354D] text-gray-300 rounded">导出日志</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredCases.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FailureCaseAnalysis;