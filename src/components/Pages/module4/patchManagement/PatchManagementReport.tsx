'use client';
import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, RefreshCw, FileText, Package, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { PageHeader } from '@/components/Common/PageStates';

const reportData = {
  summary: {
    totalTasks: 25,
    completedTasks: 22,
    successRate: 88,
    avgDuration: '25分钟',
  },
  byType: [
    { type: 'Windows', total: 15, completed: 14, successRate: 93 },
    { type: 'Linux', total: 6, completed: 5, successRate: 83 },
    { type: '数据库', total: 3, completed: 2, successRate: 67 },
    { type: '应用服务器', total: 1, completed: 1, successRate: 100 },
  ],
  recentTasks: [
    { id: 'task-001', name: 'Windows 补丁批量更新', date: '2026-06-03', status: 'completed', hosts: 50, success: 48 },
    { id: 'task-002', name: 'Linux 安全补丁部署', date: '2026-06-03', status: 'completed', hosts: 20, success: 20 },
    { id: 'task-003', name: '数据库补丁升级', date: '2026-06-02', status: 'completed', hosts: 5, success: 5 },
  ],
};

export function PatchManagementReport() {
  const [dateRange, setDateRange] = useState('week');

  const statusConfig = {
    completed: { label: '已完成', color: 'bg-green-500/20 text-green-400' },
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="补丁管理任务报告" description="生成补丁管理任务报告"
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
        <StatsCard title="任务总数" value={reportData.summary.totalTasks} icon={<Package className="w-5 h-5" />} />
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
                  <div className="text-sm text-[#9CA3AF]">{task.date} | {task.hosts}台主机</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">{task.success}成功</div>
                  {task.hosts - task.success > 0 && (
                    <div className="text-red-400 text-sm">{task.hosts - task.success}失败</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}