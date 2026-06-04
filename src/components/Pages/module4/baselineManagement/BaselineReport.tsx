'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, FileText, Eye, RefreshCw, BarChart3, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';

const reports = [
  { id: 'REP-001', name: '2026年6月基线扫描周报', type: '周报', generatedAt: '2026-06-03 08:30', status: 'generated', scans: 4, avgCompliance: 89, format: 'PDF' },
  { id: 'REP-002', name: '2026年5月基线扫描月报', type: '月报', generatedAt: '2026-06-01 00:00', status: 'generated', scans: 20, avgCompliance: 87, format: 'PDF' },
  { id: 'REP-003', name: '合规评估报告', type: '专项报告', generatedAt: '2026-06-03 10:00', status: 'generated', scans: 1, avgCompliance: 91, format: 'PDF' },
];

const stats = {
  totalReports: reports.length,
  generatedReports: reports.filter(r => r.status === 'generated').length,
  avgCompliance: Math.round((89 + 87 + 91) / 3),
  totalScans: reports.reduce((sum, r) => sum + r.scans, 0),
};

export function BaselineReport() {
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线管理任务报告" description="生成和管理基线扫描任务报告"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="generate" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <FileText className="w-4 h-4" /> 生成报告
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="报告总数" value={stats.totalReports} icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="已生成报告" value={stats.generatedReports} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="平均合规率" value={`${stats.avgCompliance}%`} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="扫描次数" value={stats.totalScans} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text" placeholder="搜索报告名称..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
              <div className="text-xs text-slate-500">共 {filteredReports.length} 条报告</div>
            </div>

            <div className="divide-y divide-[#2A354D]">
              {filteredReports.map(report => (
                <div key={report.id} className="p-4 hover:bg-[#111625]/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{report.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${report.type === '周报' ? 'bg-blue-500/20 text-blue-400' : report.type === '月报' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {report.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {report.generatedAt} | 扫描次数: {report.scans} | 平均合规率: {report.avgCompliance}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg">
                      <Download className="w-3 h-3" /> 下载 {report.format}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-[#1E2736] border border-[#2A354D] text-gray-300 text-xs rounded-lg hover:bg-[#253042]">
                      <Eye className="w-3 h-3" /> 预览
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">报告统计</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本周报告</span>
                <span className="text-white">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本月报告</span>
                <span className="text-white">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本年报告</span>
                <span className="text-white">18</span>
              </div>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">合规率趋势</h4>
            <div className="space-y-2">
              {[
                { month: '1月', rate: 82 },
                { month: '2月', rate: 84 },
                { month: '3月', rate: 86 },
                { month: '4月', rate: 85 },
                { month: '5月', rate: 87 },
                { month: '6月', rate: 89 },
              ].map(item => (
                <div key={item.month}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.month}</span>
                    <span className="text-white">{item.rate}%</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaselineReport;