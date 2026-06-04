'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, FileText, Eye, RefreshCw, BarChart3, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';

const reports = [
  { id: 'REP-001', name: '2026年6月资产分析周报', type: '周报', generatedAt: '2026-06-03 08:30', status: 'generated', analyzedAssets: 543, findings: 23, format: 'PDF' },
  { id: 'REP-002', name: '2026年5月资产分析月报', type: '月报', generatedAt: '2026-06-01 00:00', status: 'generated', analyzedAssets: 530, findings: 31, format: 'PDF' },
  { id: 'REP-003', name: '数据中心资产分析报告', type: '专项报告', generatedAt: '2026-06-03 09:45', status: 'generated', analyzedAssets: 250, findings: 15, format: 'PDF' },
];

const stats = {
  totalReports: reports.length,
  generatedReports: reports.filter(r => r.status === 'generated').length,
  avgFindings: Math.round((23 + 31 + 15) / 3),
  totalAnalyzed: reports.reduce((sum, r) => sum + r.analyzedAssets, 0),
};

export function AssetAnalysisReport() {
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产分析任务报告" description="生成和管理资产分析任务报告"
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
        <StatsCard title="平均发现问题" value={stats.avgFindings} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
        <StatsCard title="分析资产数" value={stats.totalAnalyzed} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
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
                        {report.generatedAt} | 分析资产: {report.analyzedAssets} | 发现问题: {report.findings}
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
            <h4 className="text-sm font-semibold text-white mb-3">问题发现趋势</h4>
            <div className="space-y-2">
              {[
                { month: '1月', count: 45 },
                { month: '2月', count: 38 },
                { month: '3月', count: 52 },
                { month: '4月', count: 28 },
                { month: '5月', count: 31 },
                { month: '6月', count: 23 },
              ].map(item => (
                <div key={item.month}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.month}</span>
                    <span className="text-white">{item.count}</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${(item.count / 60) * 100}%` }} />
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

export default AssetAnalysisReport;