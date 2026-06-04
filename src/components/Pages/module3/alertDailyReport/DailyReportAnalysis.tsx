'use client';

import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, BarChart3, PieChart, ArrowUp, ArrowDown } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const alertTypes = [
  { type: '入侵检测', count: 45, percentage: 28.9 },
  { type: '病毒告警', count: 32, percentage: 20.5 },
  { type: '异常流量', count: 28, percentage: 17.9 },
  { type: '违规访问', count: 22, percentage: 14.1 },
  { type: '系统漏洞', count: 18, percentage: 11.5 },
  { type: '其他', count: 11, percentage: 7.1 },
];

const hourlyTrend = [
  { hour: '00:00', count: 5, change: 0 },
  { hour: '02:00', count: 3, change: -40 },
  { hour: '04:00', count: 2, change: -33 },
  { hour: '06:00', count: 8, change: 300 },
  { hour: '08:00', count: 15, change: 88 },
  { hour: '10:00', count: 22, change: 47 },
  { hour: '12:00', count: 18, change: -18 },
  { hour: '14:00', count: 25, change: 39 },
  { hour: '16:00', count: 20, change: -20 },
  { hour: '18:00', count: 12, change: -40 },
  { hour: '20:00', count: 8, change: -33 },
  { hour: '22:00', count: 6, change: -25 },
];

const topSources = [
  { rank: 1, source: '防火墙', count: 56, percentage: 36 },
  { rank: 2, source: '入侵检测系统', count: 38, percentage: 24 },
  { rank: 3, source: '终端防护', count: 28, percentage: 18 },
  { rank: 4, source: '漏洞扫描', count: 22, percentage: 14 },
  { rank: 5, source: '日志审计', count: 12, percentage: 8 },
];

const typeColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];

export function DailyReportAnalysis() {
  const [selectedDate, setSelectedDate] = useState('2026-06-03');

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="告警日报情况分析" description="分析告警数据的统计和趋势"
        actions={[
          <button key="export" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Download className="w-4 h-4" />导出图表
          </button>,
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-400">选择日期:</span>
          <input
            type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="bg-[#20293F] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
            昨天
          </button>
          <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md">
            今天
          </button>
          <button className="px-3 py-1.5 bg-[#2A354D] hover:bg-[#364360] text-slate-300 text-xs rounded-md">
            明天
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">告警总数（昨日）</div>
          <div className="text-2xl font-bold text-white">156</div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <ArrowUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400">+12%</span>
            <span className="text-slate-500">较前日</span>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">高危告警</div>
          <div className="text-2xl font-bold text-red-400">23</div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <ArrowDown className="w-3 h-3 text-green-400" />
            <span className="text-green-400">-8%</span>
            <span className="text-slate-500">较前日</span>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">中危告警</div>
          <div className="text-2xl font-bold text-yellow-400">67</div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <ArrowUp className="w-3 h-3 text-red-400" />
            <span className="text-red-400">+5%</span>
            <span className="text-slate-500">较前日</span>
          </div>
        </div>
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="text-xs text-slate-400 mb-1">低危告警</div>
          <div className="text-2xl font-bold text-green-400">66</div>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <ArrowUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400">+18%</span>
            <span className="text-slate-500">较前日</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">告警类型分布</h4>
          </div>
          <div className="space-y-3">
            {alertTypes.map((item, index) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300">{item.type}</span>
                  <span className="text-xs text-white">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-[#111625] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${typeColors[index % typeColors.length]}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h4 className="text-sm font-semibold text-white">告警趋势（按小时）</h4>
          </div>
          <div className="flex items-end justify-between h-40">
            {hourlyTrend.map(item => (
              <div key={item.hour} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xs text-slate-400">{item.count}</div>
                <div className="w-full bg-[#111625] rounded-t-md relative" style={{ height: '140px' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md transition-all"
                    style={{ height: `${(item.count / 25) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500">{item.hour}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">告警来源TOP 5</h4>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {topSources.map(item => (
              <div key={item.rank} className="bg-[#111625] rounded-lg p-4 text-center">
                <div className={`text-3xl font-bold mb-2 ${item.rank === 1 ? 'text-yellow-400' : item.rank === 2 ? 'text-slate-300' : item.rank === 3 ? 'text-orange-400' : 'text-slate-500'}`}>
                  #{item.rank}
                </div>
                <div className="text-xs text-white mb-1">{item.source}</div>
                <div className="text-lg font-semibold text-blue-400">{item.count}</div>
                <div className="text-xs text-slate-500">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyReportAnalysis;
