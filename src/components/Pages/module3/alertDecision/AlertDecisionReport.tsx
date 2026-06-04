'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Eye, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockReports = [
  { id: 'RPT-001', name: '告警分析决策日报', period: '2024-01-15', generatedAt: '2024-01-15 08:00:00', status: 'generated', type: 'daily' },
  { id: 'RPT-002', name: '告警分析决策周报', period: '2024-01-08至2024-01-14', generatedAt: '2024-01-14 18:00:00', status: 'generated', type: 'weekly' },
  { id: 'RPT-003', name: '告警分析决策日报', period: '2024-01-14', generatedAt: '2024-01-14 08:00:00', status: 'generated', type: 'daily' },
  { id: 'RPT-004', name: '告警分析决策月报', period: '2023-12', generatedAt: '2024-01-01 09:00:00', status: 'generated', type: 'monthly' },
  { id: 'RPT-005', name: '告警分析决策日报', period: '2024-01-13', generatedAt: '2024-01-13 08:00:00', status: 'generating', type: 'daily' },
];

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = { daily: '日报', weekly: '周报', monthly: '月报' };
  return labels[type] || type;
};

const getTypeStyle = (type: string): string => {
  const styles: Record<string, string> = {
    daily: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    weekly: 'bg-green-500/20 text-green-400 border-green-500/40',
    monthly: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  };
  return styles[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
};

const getStatusStyle = (status: string) => status === 'generated'
  ? 'bg-green-500/20 text-green-400 border-green-500/40'
  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';

const getStatusText = (status: string) => status === 'generated' ? '已生成' : '生成中';

export function AlertDecisionReport() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">告警分析决策任务报告</h1>
          <p className="text-slate-400 mt-1">查看和生成决策分析相关报告</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Calendar className="w-4 h-4 mr-2" />选择日期范围
          </Button>
          <Button variant="primary">
            <RefreshCw className="w-4 h-4 mr-2" />生成报告
          </Button>
        </div>
      </div>

      <Card padding="none">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">报告概览</h3>
              <div className="space-y-3">
                {mockReports.map((report) => (
                  <div
                    key={report.id}
                    className={`bg-slate-800/50 rounded-lg p-3 cursor-pointer transition-colors ${selectedReport.id === report.id ? 'ring-2 ring-blue-500' : 'hover:bg-slate-800'}`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-slate-50 font-medium">{report.name}</p>
                        <p className="text-slate-500 text-sm">{report.period}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getStatusStyle(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded border ${getTypeStyle(report.type)}`}>
                        {getTypeLabel(report.type)}
                      </span>
                      <span className="text-slate-500 text-xs">{report.generatedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">报告内容预览</h3>
              <div className="bg-slate-800/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                  <div>
                    <h4 className="text-xl font-bold text-slate-50">{selectedReport.name}</h4>
                    <p className="text-slate-400 mt-1">报告周期: {selectedReport.period}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm"><Eye className="w-4 h-4 mr-2" />在线查看</Button>
                    <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" />下载PDF</Button>
                    <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" />下载Excel</Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">一、分析总览</h5>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-blue-400">5</p>
                        <p className="text-slate-500 text-sm mt-1">分析任务数</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-orange-400">48</p>
                        <p className="text-slate-500 text-sm mt-1">待甄别告警</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-400">475</p>
                        <p className="text-slate-500 text-sm mt-1">已决策数</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-400">313</p>
                        <p className="text-slate-500 text-sm mt-1">自动处置数</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">二、甄别统计</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                          <p className="text-2xl font-bold text-red-400">85%</p>
                        </div>
                        <p className="text-slate-50">真实攻击</p>
                        <p className="text-slate-500 text-sm mt-1">364条</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                          <p className="text-2xl font-bold text-green-400">15%</p>
                        </div>
                        <p className="text-slate-50">误报</p>
                        <p className="text-slate-500 text-sm mt-1">66条</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">三、决策分布</h5>
                    <div className="space-y-2">
                      {[
                        { action: '阻断', count: 185, percentage: 39 },
                        { action: '隔离', count: 95, percentage: 20 },
                        { action: '隔离主机', count: 33, percentage: 7 },
                        { action: '忽略', count: 162, percentage: 34 },
                      ].map((item) => (
                        <div key={item.action} className="flex items-center">
                          <span className="w-24 text-slate-400 text-sm">{item.action}</span>
                          <div className="flex-1 mx-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${item.percentage}%` }} />
                          </div>
                          <span className="w-16 text-right text-slate-300 text-sm">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-slate-400 font-medium mb-3">四、自动处置率</h5>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: '66%' }} />
                        </div>
                      </div>
                      <span className="ml-4 text-2xl font-bold text-green-400">66%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AlertDecisionReport;
