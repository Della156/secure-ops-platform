'use client';

import { useState } from 'react';
import { Download, Calendar, Eye, RefreshCw } from 'lucide-react';

const mockReports = [
  { id: 'RPT-SO-001', name: '安全编排日报', period: '2024-01-15', generatedAt: '2024-01-15 08:00:00', status: 'generated', type: 'daily' },
  { id: 'RPT-SO-002', name: '安全编排周报', period: '2024-01-08至2024-01-14', generatedAt: '2024-01-14 18:00:00', status: 'generated', type: 'weekly' },
  { id: 'RPT-SO-003', name: '安全编排日报', period: '2024-01-14', generatedAt: '2024-01-14 08:00:00', status: 'generated', type: 'daily' },
];

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    daily: '日报',
    weekly: '周报',
    monthly: '月报',
  };
  return labels[type] || type;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    daily: 'bg-blue-500/20 text-blue-400',
    weekly: 'bg-green-500/20 text-green-400',
    monthly: 'bg-purple-500/20 text-purple-400',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-400';
};

export function OrchestrationReport() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">编排任务报告</h1>
          <p className="text-slate-400 mt-1">查看和生成编排任务相关报告</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded-md">
            <Calendar className="w-3.5 h-3.5" />选择日期范围
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            <RefreshCw className="w-3.5 h-3.5" />生成报告
          </button>
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
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeColor(report.type)}`}>
                    {getTypeLabel(report.type)}
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
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-sm rounded">
                  <Download className="w-3.5 h-3.5" />下载Excel
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h5 className="text-slate-400 font-medium mb-3">一、执行概览</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">8</p>
                    <p className="text-slate-500 text-xs mt-1">编排任务数</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">156</p>
                    <p className="text-slate-500 text-xs mt-1">触发次数</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">96%</p>
                    <p className="text-slate-500 text-xs mt-1">成功率</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-400">32</p>
                    <p className="text-slate-500 text-xs mt-1">处置动作数</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-slate-400 font-medium mb-3">二、规则执行统计</h5>
                <div className="space-y-2">
                  {[
                    { rule: '高优先级告警自动阻断', executions: 45, percentage: 29 },
                    { rule: '中等告警隔离主机', executions: 38, percentage: 24 },
                    { rule: '低优先级告警记录', executions: 28, percentage: 18 },
                    { rule: '威胁情报匹配', executions: 25, percentage: 16 },
                    { rule: '资产关联分析', executions: 20, percentage: 13 },
                  ].map(item => (
                    <div key={item.rule} className="flex items-center">
                      <span className="w-36 text-slate-400 text-sm">{item.rule}</span>
                      <div className="flex-1 mx-4 h-2 bg-[#111625] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <span className="w-16 text-right text-slate-300 text-sm">{item.executions}次</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-slate-400 font-medium mb-3">三、处置动作分布</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                      <p className="text-xl font-bold text-red-400">45%</p>
                    </div>
                    <p className="text-slate-50">阻断IP</p>
                    <p className="text-slate-500 text-xs mt-1">70次</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                      <p className="text-xl font-bold text-orange-400">28%</p>
                    </div>
                    <p className="text-slate-50">隔离主机</p>
                    <p className="text-slate-500 text-xs mt-1">44次</p>
                  </div>
                  <div className="bg-[#111625] rounded-lg p-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                      <p className="text-xl font-bold text-green-400">27%</p>
                    </div>
                    <p className="text-slate-50">记录日志</p>
                    <p className="text-slate-500 text-xs mt-1">42次</p>
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