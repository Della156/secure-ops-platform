'use client';

import { useState } from 'react';
import { Download, Calendar, Eye, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockReports = [
  { id: 'RPT-SIT-001', name: '安全态势日报', period: '2024-01-15', generatedAt: '2024-01-15 08:00:00', type: 'daily' },
  { id: 'RPT-SIT-002', name: '安全态势周报', period: '2024-01-08至2024-01-14', generatedAt: '2024-01-14 18:00:00', type: 'weekly' },
  { id: 'RPT-SIT-003', name: '安全态势日报', period: '2024-01-14', generatedAt: '2024-01-14 08:00:00', type: 'daily' },
];

export function SituationReport() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);

  const stats = {
    totalThreats: 156,
    resolvedThreats: 142,
    activeThreats: 14,
    threatRate: -8,
    assetRisk: 68,
    compliance: 92,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">态势感知报告</h1>
          <p className="text-slate-400 mt-1">查看和生成安全态势相关报告</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Calendar className="w-3.5 h-3.5" />选择日期范围
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            生成报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">威胁总数</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalThreats}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">较昨日 -12%</span>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">已处置威胁</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.resolvedThreats}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">较昨日 +8%</span>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">活跃威胁</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{stats.activeThreats}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">较昨日 -20%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">报告列表</h3>
          <div className="space-y-3">
            {mockReports.map(report => (
              <div
                key={report.id}
                className={`bg-[#20293F] border border-[#2A354D] rounded-lg p-3 cursor-pointer transition-all ${
                  selectedReport.id === report.id ? 'ring-1 ring-blue-500' : 'hover:bg-[#111625]/50'
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{report.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{report.period}</p>
                  </div>
                  <span className="text-green-400 text-xs">已生成</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    report.type === 'daily' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {report.type === 'daily' ? '日报' : '周报'}
                  </span>
                  <span className="text-slate-500 text-xs">{report.generatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">报告内容预览</h3>
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A354D]">
              <div>
                <h4 className="text-xl font-bold text-white">{selectedReport.name}</h4>
                <p className="text-slate-400 mt-1">报告周期: {selectedReport.period}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded">
                  <Eye className="w-3.5 h-3.5" />在线查看
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded">
                  <Download className="w-3.5 h-3.5" />下载PDF
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h5 className="text-slate-400 font-medium mb-3">一、态势总览</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{stats.activeThreats}</p>
                    <p className="text-slate-500 text-xs mt-1">活跃威胁</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{stats.assetRisk}</p>
                    <p className="text-slate-500 text-xs mt-1">资产风险指数</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{stats.compliance}%</p>
                    <p className="text-slate-500 text-xs mt-1">合规率</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{Math.round(stats.resolvedThreats / stats.totalThreats * 100)}%</p>
                    <p className="text-slate-500 text-xs mt-1">处置率</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-slate-400 font-medium mb-3">二、威胁趋势</h5>
                <div className="space-y-2">
                  {['近1小时', '近6小时', '近24小时'].map((period, i) => (
                    <div key={period}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{period}</span>
                        <span className="text-slate-300">{[28, 95, 156][i]} 次威胁</span>
                      </div>
                      <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-orange-400" style={{ width: `${[25, 60, 100][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-slate-400 font-medium mb-3">三、风险分布</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                      <p className="text-lg font-bold text-red-400">35%</p>
                    </div>
                    <p className="text-slate-50">高危威胁</p>
                    <p className="text-slate-500 text-xs mt-1">55起</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                      <p className="text-lg font-bold text-yellow-400">45%</p>
                    </div>
                    <p className="text-slate-50">中危威胁</p>
                    <p className="text-slate-500 text-xs mt-1">70起</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                      <p className="text-lg font-bold text-green-400">20%</p>
                    </div>
                    <p className="text-slate-50">低危威胁</p>
                    <p className="text-slate-500 text-xs mt-1">31起</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}