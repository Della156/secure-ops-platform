'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, CheckCircle2, Clock, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatusBadge } from '@/components/Common/StatusBadge';

const results = [
  {
    id: 'RES-001',
    taskId: 'SCAN-001',
    baseline: '操作系统安全基线',
    status: 'completed',
    startTime: '2026-06-03 08:00',
    endTime: '2026-06-03 08:15',
    assets: 45,
    compliant: 42,
    nonCompliant: 3,
    details: [
      { asset: 'server-01', status: 'compliant', issues: 0 },
      { asset: 'server-02', status: 'non-compliant', issues: 2 },
      { asset: 'server-03', status: 'compliant', issues: 0 },
    ]
  },
  {
    id: 'RES-002',
    taskId: 'SCAN-002',
    baseline: '数据库安全基线',
    status: 'completed',
    startTime: '2026-06-03 09:00',
    endTime: '2026-06-03 09:20',
    assets: 23,
    compliant: 20,
    nonCompliant: 3,
    details: [
      { asset: 'db-01', status: 'compliant', issues: 0 },
      { asset: 'db-02', status: 'non-compliant', issues: 3 },
    ]
  },
];

export function BaselineScanResult() {
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const filteredResults = results.filter(result => {
    if (search && !result.baseline.includes(search) && !result.taskId.includes(search)) return false;
    return true;
  });

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线扫描结果分析" description="分析和查看基线扫描结果"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" /> 导出报告
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索基线名称..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input type="date" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none" />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
              查询
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">结果ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">基线名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">扫描资产数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">合规数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">不合规数</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredResults.map(result => (
                <>
                  <tr key={result.id} className="hover:bg-[#111625]/50 cursor-pointer" onClick={() => toggleRow(result.id)}>
                    <td className="px-4 py-3 text-sm text-blue-400 font-mono">{result.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{result.taskId}</td>
                    <td className="px-4 py-3 text-sm text-white">{result.baseline}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={result.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-white">{result.assets}</td>
                    <td className="px-4 py-3 text-sm text-green-400">{result.compliant}</td>
                    <td className="px-4 py-3 text-sm text-red-400">{result.nonCompliant}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {expandedRows.includes(result.id) ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <Eye className="w-3 h-3" />查看详情
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.includes(result.id) && (
                    <tr key={`${result.id}-detail`}>
                      <td colSpan={8} className="px-4 py-4 bg-[#111625]/30">
                        <div className="ml-8">
                          <div className="text-xs text-slate-400 mb-2">资产详情:</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {result.details.map((detail, idx) => (
                              <div key={idx} className={`p-3 rounded-lg ${detail.status === 'compliant' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                <div className="flex items-center gap-2">
                                  {detail.status === 'compliant' ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                  )}
                                  <span className="text-sm text-white">{detail.asset}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">问题数: {detail.issues}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BaselineScanResult;