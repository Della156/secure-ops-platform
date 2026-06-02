'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, FileText, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryDetail {
  findings: string[];
  recommendations: string[];
  affectedServices: string[];
}

interface HistoryItem {
  id: string;
  title: string;
  target: string;
  result: 'success' | 'failed';
  diagTime: string;
  duration: string;
  reportUrl: string;
  detail: HistoryDetail;
}

const mockHistory: HistoryItem[] = [
  { 
    id: 'SD-HIST-001', 
    title: '系统故障排查', 
    target: '服务器SRV-01', 
    result: 'success', 
    diagTime: '2026-06-01 10:30:00', 
    duration: '00:12:18',
    reportUrl: '#',
    detail: {
      findings: ['CPU使用率正常', '内存使用率正常', '网络连接正常', '服务运行正常'],
      recommendations: ['系统运行正常，无需处理', '建议定期检查'],
      affectedServices: ['nginx', 'mysql', 'redis']
    }
  },
  { 
    id: 'SD-HIST-002', 
    title: '服务异常分析', 
    target: '应用服务器APP-02', 
    result: 'failed', 
    diagTime: '2026-05-31 14:15:00', 
    duration: '00:08:45',
    reportUrl: '#',
    detail: {
      findings: ['API网关服务异常', '数据库连接失败', '内存泄漏检测'],
      recommendations: ['重启API网关服务', '检查数据库连接配置', '优化内存使用'],
      affectedServices: ['api-gateway', 'app-service']
    }
  },
];

export function SysDiagHistoryQuery() {
  const [history] = useState(mockHistory);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredHistory = history.filter(item => 
    !searchKeyword || item.title.includes(searchKeyword) || item.id.includes(searchKeyword)
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">系统故障诊断任务历史查询</h2>
        <p className="text-sm text-gray-400 mt-1">历史诊断任务记录查询，诊断详情查看，诊断报告下载</p>
      </div>

      <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务标题或ID..."
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
            </div>
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
                </div>
                <span className="text-sm text-gray-400">{item.target}</span>
                <span className="text-sm text-gray-400">{item.diagTime}</span>
                <span className="text-sm text-gray-400">耗时: {item.duration}</span>
                {item.result === 'success' ? (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />成功
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />失败
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  下载报告
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
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">诊断发现</p>
                    <ul className="space-y-1">
                      {item.detail.findings.map((finding, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">处理建议</p>
                    <ul className="space-y-1">
                      {item.detail.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#111827] rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2">受影响服务</p>
                    <div className="flex flex-wrap gap-2">
                      {item.detail.affectedServices.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">{service}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}