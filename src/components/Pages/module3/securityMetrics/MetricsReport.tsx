'use client';

import { useState } from 'react';
import { Download, Calendar, Eye, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

const mockReports = [
  { id: 'rpt-001', name: '安全日报', period: '2024-01-15', type: 'daily', status: 'generated' },
  { id: 'rpt-002', name: '安全周报', period: '2024-01-08至2024-01-14', type: 'weekly', status: 'generated' },
  { id: 'rpt-003', name: '安全月报', period: '2024-01', type: 'monthly', status: 'generating' },
];

export function MetricsReport() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);

  const stats = {
    totalAlerts: 156,
    resolvedAlerts: 147,
    activeThreats: 9,
    attackRate: -12,
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">安全指标报告</h1>
          <p className="text-slate-400 mt-1">生成和查看安全指标报告</p>
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

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">威胁总数</span>
            <AlertTriangle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.totalAlerts}</div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">已处置</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mt-2">{stats.resolvedAlerts}</div>
        </div>
        <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">活跃威胁</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mt-2">{stats.activeThreats}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">-12%</span>
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
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    report.status === 'generated' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {report.status === 'generated' ? '已生成' : '生成中'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    report.type === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                    report.type === 'weekly' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {report.type === 'daily' ? '日报' : report.type === 'weekly' ? '周报' : '月报'}
                  </span>
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
                <h5 className="text-slate-400 font-medium mb-3">一、安全态势概览</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{stats.activeThreats}</p>
                    <p className="text-slate-500 text-xs mt-1">活跃威胁</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {Math.round(stats.resolvedAlerts / stats.totalAlerts * 100)}%
                    </p>
                    <p className="text-slate-500 text-xs mt-1">处置率</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{stats.attackRate}%</p>
                    <p className="text-slate-500 text-xs mt-1">攻击趋势</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}