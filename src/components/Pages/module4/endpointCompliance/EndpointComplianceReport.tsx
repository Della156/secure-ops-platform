'use client';
import React, { useState } from 'react';
import { Calendar, Download, RefreshCw, FileText, Smartphone, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { PageHeader } from '@/components/Common/PageStates';

const reportData = {
  summary: {
    totalTasks: 28,
    completedTasks: 26,
    successRate: 93,
    avgDuration: '20分钟',
  },
  byType: [
    { type: '安全软件升级', total: 12, completed: 11, successRate: 92 },
    { type: '合规扫描', total: 8, completed: 8, successRate: 100 },
    { type: '版本同步', total: 5, completed: 4, successRate: 80 },
    { type: '补丁更新', total: 3, completed: 3, successRate: 100 },
  ],
  recentTasks: [
    { id: 'task-001', name: '终端安全软件升级', date: '2026-06-03', status: 'completed' },
    { id: 'task-002', name: '终端合规扫描', date: '2026-06-03', status: 'completed' },
    { id: 'task-003', name: '安全软件版本同步', date: '2026-06-02', status: 'completed' },
  ],
};

export function EndpointComplianceReport() {
  const [dateRange, setDateRange] = useState('week');

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="终端合规管理任务报告" description="生成终端合规管理任务报告"
        actions={[
          { icon: RefreshCw, label: '刷新', onClick: () => {} },
          { icon: Download, label: '导出PDF', onClick: () => {} },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
          {['today', 'week', 'month', 'quarter'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                dateRange === range 
                  ? 'bg-[#0066FF] text-white' 
                  : 'bg-[#181F32] text-[#9CA3AF] hover:bg-[#21262D]'
              }`}
            >
              {range === 'today' ? '今日' : range === 'week' ? '本周' : range === 'month' ? '本月' : '本季度'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#181F32] border border-[#2A354D] rounded-lg">
          <Calendar className="w-4 h-4 text-[#6E7681]" />
          <input
            type="date"
            className="bg-transparent text-[#F3F4F6] focus:outline-none text-sm"
          />
        </div>
      </div>

      <StatsCardGrid>
        <StatsCard title="任务总数" value={reportData.summary.totalTasks} icon={<Smartphone className="w-5 h-5" />} />
        <StatsCard title="已完成任务" value={reportData.summary.completedTasks} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="成功率" value={`${reportData.summary.successRate}%`} icon={<TrendingUp className="w-5 h-5" />} color="blue" />
        <StatsCard title="平均时长" value={reportData.summary.avgDuration} icon={<FileText className="w-5 h-5" />} color="purple" />
      </StatsCardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0D1117] rounded-xl border border-[#2A354D] p-6">
          <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">按类型统计</h3>
          <div className="space-y-4">
            {reportData.byType.map(item => (
              <div key={item.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#F3F4F6]">{item.type}</span>
                  <span className="text-[#9CA3AF]">{item.completed}/{item.total} ({item.successRate}%)</span>
                </div>
                <div className="h-3 bg-[#181F32] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.successRate >= 90 ? 'bg-[#00D4AA]' : item.successRate >= 70 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                    style={{ width: `${item.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1117] rounded-xl border border-[#2A354D] p-6">
          <h3 className="text-lg font-semibold text-[#F3F4F6] mb-4">近期任务</h3>
          <div className="space-y-4">
            {reportData.recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-[#181F32] rounded-lg">
                <div>
                  <div className="font-medium text-[#F3F4F6]">{task.name}</div>
                  <div className="text-sm text-[#9CA3AF]">{task.date}</div>
                </div>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">已完成</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}