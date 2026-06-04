'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, CheckCircle2, Clock, AlertTriangle, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const reports = [
  { id: 'RPT-DR-001', name: '告警日报_20260603', createTime: '2026-06-03 08:00', status: 'completed', downloadCount: 5 },
  { id: 'RPT-DR-002', name: '告警日报_20260602', createTime: '2026-06-02 08:00', status: 'completed', downloadCount: 3 },
  { id: 'RPT-DR-003', name: '告警日报_20260601', createTime: '2026-06-01 08:00', status: 'completed', downloadCount: 8 },
];

const statusConfig = {
  completed: { label: '已生成', color: 'text-green-400', bg: 'bg-green-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
};

export function DailyReportReport() {
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const filtered = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    return true;
  });

  const reportStats = {
    totalAlerts: 156,
    disposedAlerts: 142,
    disposalRate: 91,
    highLevel: 23,
    mediumLevel: 67,
    lowLevel: 66,
  };

  const alertTypes = [
    { type: '入侵检测', count: 45, percentage: 28.9 },
    { type: '病毒告警', count: 32, percentage: 20.5 },
    { type: '异常流量', count: 28, percentage: 17.9 },
    { type: '违规访问', count: 22, percentage: 14.1 },
    { type: '系统漏洞', count: 18, percentage: 11.5 },
    { type: '其他', count: 11, percentage: 7.1 },
  ];

  const hourlyTrend = [
    { hour: '08:00', count: 15 }, { hour: '10:00', count: 22 }, { hour: '12:00', count: 18 },
    { hour: '14:00', count: 25 }, { hour: '16:00', count: 20 }, { hour: '18:00', count: 12 },
    { hour: '20:00', count: 8 }, { hour: '22:00', count: 6 },
  ];

  const disposalStats = {
    avgDuration: '15分钟',
    autoDispose: 85,
    manualDispose: 42,
    pending: 17,
  };

  const topSources = [
    { rank: 1, source: '防火墙', count: 56 },
    { rank: 2, source: '入侵检测系统', count: 38 },
    { rank: 3, source: '终端防护', count: 28 },
    { rank: 4, source: '漏洞扫描', count: 22 },
    { rank: 5, source: '日志审计', count: 12 },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="告警日报任务报告" description="查看告警日报的完整报告内容"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" />下载PDF
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]">
              <div className="relative mb-2">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text" placeholder="搜索报告..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-6 pr-3 py-1 bg-[#111625] border border-[#2A354D] text-white text-xs rounded-md focus:border-blue-500 outline-none"
                />
              </div>
              <h4 className="text-sm font-semibold text-white">报告列表 ({filtered.length})</h4>
            </div>
            <div className="space-y-2">
              {filtered.map(report => {
                const sc = statusConfig[report.status as keyof typeof statusConfig];
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedReport?.id === report.id ? 'bg-[#111625]' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-400 font-mono">{report.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}>
                        {sc.icon}{sc.label}
                      </span>
                    </div>
                    <div className="text-sm text-white font-medium">{report.name}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.createTime}</span>
                      <span>·</span>
                      <span>下载 {report.downloadCount} 次</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
            <div className="text-center mb-6 pb-4 border-b border-[#2A354D]">
              <h2 className="text-xl font-bold text-white mb-2">{selectedReport.name}</h2>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <span>生成时间: {selectedReport.createTime}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-blue-400 mb-3">一、总览</div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">告警总数</div>
                    <div className="text-2xl font-bold text-white">{reportStats.totalAlerts}</div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">已处置</div>
                    <div className="text-2xl font-bold text-green-400">{reportStats.disposedAlerts}</div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">处置率</div>
                    <div className="text-2xl font-bold text-blue-400">{reportStats.disposalRate}%</div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">平均处置时长</div>
                    <div className="text-2xl font-bold text-purple-400">{disposalStats.avgDuration}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />告警类型分布
                  </div>
                  <div className="space-y-2">
                    {alertTypes.map(item => (
                      <div key={item.type} className="flex items-center justify-between bg-[#111625] rounded-lg px-3 py-2">
                        <span className="text-xs text-slate-300">{item.type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#20293F] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                          </div>
                          <span className="text-xs text-white">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />告警趋势（按小时）
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4">
                    <div className="flex items-end justify-between h-32">
                      {hourlyTrend.map(item => (
                        <div key={item.hour} className="flex flex-col items-center gap-1 flex-1">
                          <div className="w-full bg-[#20293F] rounded-t-md relative" style={{ height: '100px' }}>
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md"
                              style={{ height: `${(item.count / 25) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{item.hour}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-400 mb-3">三、处置情况</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111625] rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-2">自动处置</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#20293F] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(disposalStats.autoDispose / reportStats.disposedAlerts) * 100}%` }} />
                      </div>
                      <span className="text-sm text-white">{disposalStats.autoDispose}</span>
                    </div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-2">人工处置</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#20293F] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(disposalStats.manualDispose / reportStats.disposedAlerts) * 100}%` }} />
                      </div>
                      <span className="text-sm text-white">{disposalStats.manualDispose}</span>
                    </div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-2">待处置</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#20293F] rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(disposalStats.pending / reportStats.totalAlerts) * 100}%` }} />
                      </div>
                      <span className="text-sm text-white">{disposalStats.pending}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-400 mb-3">四、告警来源TOP 5</div>
                <div className="bg-[#111625] rounded-lg p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {topSources.map(item => (
                      <div key={item.rank} className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${item.rank === 1 ? 'text-yellow-400' : item.rank === 2 ? 'text-slate-300' : item.rank === 3 ? 'text-orange-400' : 'text-slate-500'}`}>
                          #{item.rank}
                        </div>
                        <div className="text-xs text-slate-400">{item.source}</div>
                        <div className="text-lg font-semibold text-blue-400">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-400 mb-3">五、结论建议</div>
                <div className="bg-[#111625] rounded-lg p-4">
                  <p className="text-xs text-slate-300">
                    今日告警总数为 {reportStats.totalAlerts} 条，处置率达到 {reportStats.disposalRate}%，整体处置情况良好。
                    建议关注高危告警的处置时效，当前仍有 {disposalStats.pending} 条告警待处置，请及时处理。
                    防火墙是主要告警来源，建议定期检查防火墙规则配置。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyReportReport;
