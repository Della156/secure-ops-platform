'use client';
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, FileText, Eye, RefreshCw, Server, Database, Network, Cloud, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';

const reports = [
  { id: 'REP-001', name: '2026年6月资产发现周报', type: '周报', generatedAt: '2026-06-03 08:00', status: 'generated', assetCount: 543, newAssetCount: 45, format: 'PDF' },
  { id: 'REP-002', name: '2026年5月资产发现月报', type: '月报', generatedAt: '2026-06-01 00:00', status: 'generated', assetCount: 521, newAssetCount: 128, format: 'PDF' },
  { id: 'REP-003', name: '2026年Q2资产发现季报', type: '季报', generatedAt: '2026-07-01 00:00', status: 'generating', assetCount: 0, newAssetCount: 0, format: '-' },
  { id: 'REP-004', name: '全网资产扫描报告', type: '专项报告', generatedAt: '2026-06-03 09:35', status: 'generated', assetCount: 250, newAssetCount: 15, format: 'PDF' },
];

export function AssetDiscoveryReport() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredReports = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    if (typeFilter && report.type !== typeFilter) return false;
    return true;
  });

  const types = [...new Set(reports.map(r => r.type))];

  const stats = {
    totalReports: reports.length,
    generatedReports: reports.filter(r => r.status === 'generated').length,
    generatingReports: reports.filter(r => r.status === 'generating').length,
    totalAssets: reports.reduce((sum, r) => sum + r.assetCount, 0),
  };

  const assetTypeDistribution = [
    { type: '服务器', count: 234, percentage: 35 },
    { type: '数据库', count: 156, percentage: 23 },
    { type: '网络设备', count: 89, percentage: 13 },
    { type: '云服务', count: 64, percentage: 10 },
    { type: '终端设备', count: 128, percentage: 19 },
  ];

  const typeIcons = {
    '服务器': Server,
    '数据库': Database,
    '网络设备': Network,
    '云服务': Cloud,
    '终端设备': BarChart3,
  };

  const typeColors = {
    '服务器': 'bg-blue-500/20 text-blue-400',
    '数据库': 'bg-green-500/20 text-green-400',
    '网络设备': 'bg-purple-500/20 text-purple-400',
    '云服务': 'bg-orange-500/20 text-orange-400',
    '终端设备': 'bg-cyan-500/20 text-cyan-400',
  };

  const handleGenerateReport = () => {
    alert('生成报告中...');
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产发现任务报告" description="生成和管理资产发现任务报告"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="generate" onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <FileText className="w-4 h-4" /> 生成报告
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="报告总数" value={stats.totalReports} icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="已生成报告" value={stats.generatedReports} icon={<Eye className="w-5 h-5" />} color="green" />
        <StatsCard title="生成中" value={stats.generatingReports} icon={<RefreshCw className="w-5 h-5" />} color="yellow" />
        <StatsCard title="覆盖资产" value={stats.totalAssets} icon={<Server className="w-5 h-5" />} color="blue" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text" placeholder="搜索报告名称..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                  >
                    <option value="">全部类型</option>
                    {types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
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
                        <span className={`text-xs px-2 py-0.5 rounded ${report.type === '周报' ? 'bg-blue-500/20 text-blue-400' : report.type === '月报' ? 'bg-green-500/20 text-green-400' : report.type === '季报' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {report.type}
                        </span>
                        {report.status === 'generating' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 animate-pulse">生成中</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {report.generatedAt} | 资产数: {report.assetCount} | 新增: {report.newAssetCount}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'generated' && (
                      <>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg">
                          <Download className="w-3 h-3" /> 下载 {report.format}
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#1E2736] border border-[#2A354D] text-gray-300 text-xs rounded-lg hover:bg-[#253042]">
                          <Eye className="w-3 h-3" /> 预览
                        </button>
                      </>
                    )}
                    {report.status === 'generating' && (
                      <span className="text-xs text-yellow-400 animate-pulse">正在生成...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" /> 资产类型分布
            </h4>
            <div className="space-y-3">
              {assetTypeDistribution.map(item => {
                const Icon = typeIcons[item.type as keyof typeof typeIcons] || Server;
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <Icon className="w-3 h-3" />{item.type}
                      </span>
                      <span className="text-xs text-white">{item.count}</span>
                    </div>
                    <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${typeColors[item.type as keyof typeof typeColors].split(' ')[0]}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-3">报告统计</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本周报告</span>
                <span className="text-white">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本月报告</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">本年报告</span>
                <span className="text-white">45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDiscoveryReport;