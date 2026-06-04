'use client';

import React, { useState } from 'react';
import { Download, Clock, CheckCircle2, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const undisposedAlerts = [
  { id: 'ALT-001', name: '可疑端口扫描', level: '高危', time: '2026-06-03 08:15', duration: '2小时30分' },
  { id: 'ALT-002', name: '多次失败登录尝试', level: '中危', time: '2026-06-03 09:20', duration: '1小时25分' },
  { id: 'ALT-003', name: '异常流量检测', level: '高危', time: '2026-06-03 10:00', duration: '45分钟' },
  { id: 'ALT-004', name: '病毒特征匹配', level: '高危', time: '2026-06-03 10:30', duration: '15分钟' },
  { id: 'ALT-005', name: '策略违规访问', level: '低危', time: '2026-06-03 11:00', duration: '0分钟' },
];

const disposalMethods = [
  { method: '自动处置', count: 85, percentage: 59 },
  { method: '人工处置', count: 42, percentage: 29 },
  { method: '待处置', count: 17, percentage: 12 },
];

const levelColors = {
  '高危': 'bg-red-500/20 text-red-400',
  '中危': 'bg-yellow-500/20 text-yellow-400',
  '低危': 'bg-green-500/20 text-green-400',
};

export function AlertDisposalSummary() {
  const [selectedLevel, setSelectedLevel] = useState('');

  const filteredAlerts = undisposedAlerts.filter(alert => {
    if (selectedLevel && alert.level !== selectedLevel) return false;
    return true;
  });

  const stats = {
    disposalRate: 88,
    avgDuration: '15分钟',
    autoDispose: 85,
    manualDispose: 42,
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="当日告警处置情况总结" description="查看当日告警的处置情况和未处置清单"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" />导出未处置清单
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#111625" strokeWidth="12" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="#4F46E5" strokeWidth="12" fill="none" strokeDasharray={`${stats.disposalRate * 3.52} 352`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-3xl font-bold text-white">{stats.disposalRate}%</div>
                    <div className="text-xs text-slate-400">告警处置率</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-semibold text-white">平均处置时长</h4>
            </div>
            <div className="text-2xl font-bold text-white">{stats.avgDuration}</div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">较昨日减少 5分钟</span>
            </div>
          </div>

          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="text-sm font-semibold text-white mb-3">处置方式分布</div>
            <div className="space-y-3">
              {disposalMethods.map(item => (
                <div key={item.method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300">{item.method}</span>
                    <span className="text-xs text-white">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.method === '自动处置' ? 'bg-green-500' : item.method === '人工处置' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-sm font-semibold text-white">未处置告警清单</h4>
                  <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded">{filteredAlerts.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedLevel('')} className={`px-3 py-1 text-xs rounded-md transition ${!selectedLevel ? 'bg-blue-600 text-white' : 'bg-[#2A354D] text-slate-400 hover:bg-[#364360]'}`}>
                    全部
                  </button>
                  <button onClick={() => setSelectedLevel('高危')} className={`px-3 py-1 text-xs rounded-md transition ${selectedLevel === '高危' ? 'bg-red-500 text-white' : 'bg-[#2A354D] text-slate-400 hover:bg-[#364360]'}`}>
                    高危
                  </button>
                  <button onClick={() => setSelectedLevel('中危')} className={`px-3 py-1 text-xs rounded-md transition ${selectedLevel === '中危' ? 'bg-yellow-500 text-white' : 'bg-[#2A354D] text-slate-400 hover:bg-[#364360]'}`}>
                    中危
                  </button>
                  <button onClick={() => setSelectedLevel('低危')} className={`px-3 py-1 text-xs rounded-md transition ${selectedLevel === '低危' ? 'bg-green-500 text-white' : 'bg-[#2A354D] text-slate-400 hover:bg-[#364360]'}`}>
                    低危
                  </button>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Download className="w-3 h-3" />导出
              </button>
            </div>

            <div className="divide-y divide-[#2A354D]">
              {filteredAlerts.map(alert => (
                <div key={alert.id} className="px-4 py-3 flex items-center justify-between hover:bg-[#111625]/50">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-blue-400">{alert.id}</span>
                    <span className="text-sm text-white">{alert.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${levelColors[alert.level as keyof typeof levelColors]}`}>
                      {alert.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">{alert.time}</span>
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{alert.duration}
                    </span>
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md hover:bg-blue-500/30">
                      <XCircle className="w-3 h-3" />处置
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
              <div className="text-xs text-slate-500">显示 1-{filteredAlerts.length} 条，共 {undisposedAlerts.length} 条</div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>上一页</button>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">1</button>
                <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>下一页</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertDisposalSummary;
