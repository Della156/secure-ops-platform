'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface HistoryDetail {
  findings: string[];
  recommendations: string[];
  affectedSystems: string[];
  rootCauses: string[];
}

interface HistoryItem {
  id: string;
  title: string;
  target: string;
  result: 'success' | 'failed' | 'warning';
  diagTime: string;
  duration: string;
  reportUrl: string;
  detail: HistoryDetail;
}

const mockHistory: HistoryItem[] = [
  { 
    id: 'CD-HIST-001', 
    title: '网络系统综合诊断', 
    target: '数据中心网络设备', 
    result: 'success', 
    diagTime: '2026-06-01 10:30:00', 
    duration: '00:22:15',
    reportUrl: '#',
    detail: {
      findings: ['网络拓扑结构正常', '路由表收敛良好', '交换机端口利用率合理', '防火墙规则配置正确'],
      recommendations: ['系统运行正常，建议每周巡检', '可考虑优化部分QoS策略'],
      affectedSystems: ['核心交换机', '路由器', '防火墙'],
      rootCauses: []
    }
  },
  { 
    id: 'CD-HIST-002', 
    title: '服务器集群健康检查', 
    target: '应用服务器集群', 
    result: 'warning', 
    diagTime: '2026-05-31 14:15:00', 
    duration: '00:18:45',
    reportUrl: '#',
    detail: {
      findings: ['发现2台服务器负载较高', '内存使用率超过85%', '部分应用响应时间过长'],
      recommendations: ['考虑扩容服务器集群', '优化应用内存配置', '增加缓存层'],
      affectedSystems: ['应用服务器', '缓存服务', '负载均衡器'],
      rootCauses: ['流量突增', '内存泄漏']
    }
  },
  { 
    id: 'CD-HIST-003', 
    title: '数据库性能诊断', 
    target: '主数据库集群', 
    result: 'failed', 
    diagTime: '2026-05-30 09:00:00', 
    duration: '00:25:30',
    reportUrl: '#',
    detail: {
      findings: ['主从复制延迟超过10分钟', '慢查询数量激增', '索引碎片严重', '连接池接近饱和'],
      recommendations: ['立即优化慢查询SQL', '重建索引', '增加连接池大小', '考虑读写分离'],
      affectedSystems: ['主数据库', '从数据库', '应用服务器'],
      rootCauses: ['未优化的SQL', '索引维护缺失']
    }
  },
];

export function CompDiagHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resultFilter, setResultFilter] = useState('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchKeyword || 
      item.title.includes(searchKeyword) || 
      item.id.includes(searchKeyword) ||
      item.target.includes(searchKeyword);
    const matchesResult = resultFilter === 'all' || item.result === resultFilter;
    return matchesSearch && matchesResult;
  });

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case 'success': return '成功';
      case 'failed': return '失败';
      case 'warning': return '警告';
      default: return '未知';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">综合故障诊断任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史诊断任务记录查询、详情查看、报告下载</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务标题、ID或目标..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">至</span>
              <input
                type="date"
                className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-2 bg-[#111827] border border-[#2A354D] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部结果</option>
              <option value="success">成功</option>
              <option value="warning">警告</option>
              <option value="failed">失败</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            导出记录
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <div key={item.id} className="bg-[#1E2736] border border-[#2A354D] rounded-lg overflow-hidden">
            <div 
              className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-[#2A354D]/20 transition-colors"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{item.title}</span>
                  <span className="text-xs text-gray-500">{item.id}</span>
                </div>
                <span className="text-sm text-gray-400">{item.target}</span>
                <span className="text-sm text-gray-400">{item.diagTime}</span>
                <span className="text-sm text-gray-400">耗时: {item.duration}</span>
                <span className={`flex items-center gap-1 ${getResultColor(item.result)} text-sm`}>
                  {getResultIcon(item.result)}
                  {getResultLabel(item.result)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  下载报告
                </button>
                <button 
                  className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#3A455D] text-gray-300 text-sm rounded-lg transition-colors flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  详情
                </button>
                {expandedId === item.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedId === item.id && (
              <div className="px-4 pb-4 border-t border-[#2A354D]">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#111827] rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      诊断发现
                    </p>
                    <ul className="space-y-1">
                      {item.detail.findings.map((finding, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-gray-500 mt-1">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                      处理建议
                    </p>
                    <ul className="space-y-1">
                      {item.detail.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-gray-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2">影响系统</p>
                    <div className="flex flex-wrap gap-2">
                      {item.detail.affectedSystems.map((system, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.detail.rootCauses.length > 0 && (
                    <div className="bg-[#111827] rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        根因识别
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.detail.rootCauses.map((cause, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded bg-red-500/10 text-red-400 border border-red-500/20">
                            {cause}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
