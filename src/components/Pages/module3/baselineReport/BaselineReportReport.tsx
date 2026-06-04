'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, Eye, CheckCircle2, AlertTriangle, PieChart, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const reports = [
  { id: 'RPT-BR-001', name: '主机安全基线报告_202606', status: 'completed', createTime: '2026-06-03 08:00', downloadCount: 5 },
  { id: 'RPT-BR-002', name: '网络安全基线报告_202606', status: 'completed', createTime: '2026-06-02 09:00', downloadCount: 3 },
  { id: 'RPT-BR-003', name: '系统安全基线报告_202606', status: 'running', createTime: '2026-06-03 10:00', downloadCount: 0 },
];

export function BaselineReportReport() {
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(reports[0]);

  const filtered = reports.filter(report => {
    if (search && !report.name.includes(search) && !report.id.includes(search)) return false;
    return true;
  });

  const reportData = {
    totalCheckItems: 100,
    compliantItems: 85,
    nonCompliantItems: 15,
    complianceRate: 85,
    highRisk: 3,
    mediumRisk: 7,
    lowRisk: 5,
  };

  const nonCompliantByType = [
    { type: '账户策略', count: 4, percentage: 26.7 },
    { type: '端口策略', count: 3, percentage: 20 },
    { type: '权限策略', count: 3, percentage: 20 },
    { type: '更新策略', count: 2, percentage: 13.3 },
    { type: '备份策略', count: 2, percentage: 13.3 },
    { type: '其他', count: 1, percentage: 6.7 },
  ];

  const recommendations = [
    '加强密码复杂度策略，要求至少8位并包含大小写字母和数字',
    '关闭不必要的端口，仅开放业务必需的端口',
    '审查用户权限，遵循最小权限原则',
    '及时更新系统补丁，建议在30天内完成更新',
    '建立每日备份机制，确保数据可恢复',
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="基线防护报告任务报告" description="查看基线报告的完整报告内容"
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
              {filtered.map(report => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`px-4 py-3 border-b border-[#2A354D] cursor-pointer hover:bg-[#111625]/50 ${selectedReport?.id === report.id ? 'bg-[#111625]' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-400 font-mono">{report.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${report.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {report.status === 'completed' ? '已生成' : '生成中'}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium">{report.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.createTime}</span>
                    <span>·</span>
                    <span>下载 {report.downloadCount} 次</span>
                  </div>
                </div>
              ))}
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
                <div className="text-sm font-semibold text-blue-400 mb-3">一、合规率统计</div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">检查项总数</div>
                    <div className="text-2xl font-bold text-white">{reportData.totalCheckItems}</div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">合规项</div>
                    <div className="text-2xl font-bold text-green-400">{reportData.compliantItems}</div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">不合规项</div>
                    <div className="text-2xl font-bold text-red-400">{reportData.nonCompliantItems}</div>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="text-xs text-slate-400 mb-1">合规率</div>
                    <div className="text-2xl font-bold text-blue-400">{reportData.complianceRate}%</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <PieChart className="w-4 h-4" />不合规项分布
                  </div>
                  <div className="space-y-2">
                    {nonCompliantByType.map(item => (
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
                    <AlertTriangle className="w-4 h-4" />风险等级分析
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#111625] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-red-400">高风险</span>
                        <span className="text-lg font-bold text-red-400">{reportData.highRisk}</span>
                      </div>
                      <div className="w-full h-2 bg-[#20293F] rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(reportData.highRisk / reportData.nonCompliantItems) * 100}%` }} />
                      </div>
                    </div>
                    <div className="bg-[#111625] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-yellow-400">中风险</span>
                        <span className="text-lg font-bold text-yellow-400">{reportData.mediumRisk}</span>
                      </div>
                      <div className="w-full h-2 bg-[#20293F] rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(reportData.mediumRisk / reportData.nonCompliantItems) * 100}%` }} />
                      </div>
                    </div>
                    <div className="bg-[#111625] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-400">低风险</span>
                        <span className="text-lg font-bold text-blue-400">{reportData.lowRisk}</span>
                      </div>
                      <div className="w-full h-2 bg-[#20293F] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(reportData.lowRisk / reportData.nonCompliantItems) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />整改建议
                </div>
                <div className="bg-[#111625] rounded-lg p-4">
                  <ul className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaselineReportReport;