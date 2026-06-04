'use client';
import React, { useState } from 'react';
import { Search, Download, FileText, AlertCircle, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const reports = [
  { id: 'DIFF-001', baseline: '操作系统安全基线', compareFrom: '2026-05-01', compareTo: '2026-06-01', totalChanges: 12, newIssues: 5, resolvedIssues: 8, status: 'improved' },
  { id: 'DIFF-002', baseline: '数据库安全基线', compareFrom: '2026-05-01', compareTo: '2026-06-01', totalChanges: 8, newIssues: 3, resolvedIssues: 5, status: 'improved' },
  { id: 'DIFF-003', baseline: '网络设备安全基线', compareFrom: '2026-05-01', compareTo: '2026-06-01', totalChanges: 6, newIssues: 4, resolvedIssues: 2, status: 'declined' },
];

export function BaselineDiffReport() {
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<typeof reports[0] | null>(null);

  const filteredReports = reports.filter(report => {
    if (search && !report.baseline.includes(search) && !report.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线差异报告" description="对比不同时间点的基线状态差异"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" /> 导出报告
          </button>,
          <button key="generate" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <FileText className="w-4 h-4" /> 生成报告
          </button>,
        ]}
      />

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" placeholder="搜索基线..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input type="date" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none" />
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <input type="date" className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none" />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            生成对比报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredReports.map(report => (
            <div
              key={report.id}
              className={`bg-[#20293F] border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedReport?.id === report.id ? 'border-blue-500' : 'border-[#2A354D] hover:border-blue-500/50'
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{report.baseline}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${report.status === 'improved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {report.status === 'improved' ? '状态改善' : '状态下降'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {report.compareFrom} 至 {report.compareTo}
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono">{report.id}</span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                  <span className="text-slate-300">变更: {report.totalChanges}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span className="text-slate-300">新增: {report.newIssues}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-slate-300">修复: {report.resolvedIssues}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          {selectedReport ? (
            <div className="space-y-4">
              <h3 className="text-white font-medium">差异详情</h3>
              <div className="bg-[#111625] rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">对比基线</span>
                  <span className="text-white">{selectedReport.baseline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">对比周期</span>
                  <span className="text-white">{selectedReport.compareFrom} - {selectedReport.compareTo}</span>
                </div>
                <div className="h-px bg-[#2A354D]" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-500/10 rounded-lg p-3">
                    <div className="text-xs text-red-400">新增问题</div>
                    <div className="text-xl font-bold text-red-400">{selectedReport.newIssues}</div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-3">
                    <div className="text-xs text-green-400">已修复</div>
                    <div className="text-xl font-bold text-green-400">{selectedReport.resolvedIssues}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-400">变更列表:</div>
                {[
                  { type: 'new', desc: '新增密码策略检查规则' },
                  { type: 'resolved', desc: '修复SSH端口配置检查错误' },
                  { type: 'new', desc: '新增防火墙规则检查' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-2 text-xs ${item.type === 'new' ? 'text-red-400' : 'text-green-400'}`}>
                    {item.type === 'new' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {item.desc}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <FileText className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm">请选择一份报告查看详情</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BaselineDiffReport;