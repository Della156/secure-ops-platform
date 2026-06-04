'use client';

import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Plus, Eye, Play, Clock, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { StatsCard, StatsCardGrid } from '@/components/Common/StatsCard';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { PageHeader, LoadingState } from '@/components/Common/PageStates';

const tasks = [
  { id: 'SA-001', name: '恶意软件样本分析', status: 'completed', submitTime: '2026-06-03 08:15', analysisTime: '00:15:32', threatLevel: '高危' },
  { id: 'SA-002', name: '可疑文件检测', status: 'running', submitTime: '2026-06-03 09:30', analysisTime: '00:08:15', threatLevel: '中危' },
  { id: 'SA-003', name: '勒索软件样本分析', status: 'pending', submitTime: '2026-06-03 10:00', analysisTime: '-', threatLevel: '高危' },
  { id: 'SA-004', name: '病毒样本深度检测', status: 'completed', submitTime: '2026-06-03 10:30', analysisTime: '00:22:45', threatLevel: '低危' },
  { id: 'SA-005', name: '未知样本识别', status: 'failed', submitTime: '2026-06-03 11:00', analysisTime: '00:05:20', threatLevel: '中危' },
];

const threatLevelColors = {
  '高危': 'bg-red-500/20 text-red-400',
  '中危': 'bg-yellow-500/20 text-yellow-400',
  '低危': 'bg-green-500/20 text-green-400',
};

export function SampleAnalysisView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (search && !task.name.includes(search) && !task.id.includes(search)) return false;
    if (statusFilter && task.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    malicious: tasks.filter(t => t.threatLevel === '高危').length,
  };

  if (isLoading) return <LoadingState message="加载样本分析数据..." />;

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="样本分析视图" description="管理和监控样本分析任务"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>,
          <button key="add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            <Plus className="w-4 h-4" /> 新建任务
          </button>,
        ]}
      />

      <StatsCardGrid cols={4}>
        <StatsCard title="总分析任务" value={stats.total} icon={<Clock className="w-5 h-5" />} />
        <StatsCard title="待分析样本" value={stats.pending} icon={<Zap className="w-5 h-5" />} color="yellow" />
        <StatsCard title="已完成分析" value={stats.completed} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatsCard title="恶意样本数" value={stats.malicious} icon={<AlertTriangle className="w-5 h-5" />} color="red" />
      </StatsCardGrid>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A354D] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" placeholder="搜索任务名称或ID..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md focus:border-blue-500 outline-none w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-md px-3 py-1.5 focus:border-blue-500 outline-none"
              >
                <option value="">全部状态</option>
                <option value="pending">待分析</option>
                <option value="running">分析中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-slate-500">共 {filteredTasks.length} 条记录</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">任务名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">威胁等级</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">提交时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">分析耗时</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A354D]">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-[#111625]/50">
                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{task.id}</td>
                  <td className="px-4 py-3 text-sm text-white">{task.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${threatLevelColors[task.threatLevel]}`}>
                      {task.threatLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{task.submitTime}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{task.analysisTime}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={task.status} pulse={task.status === 'running'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {task.status === 'pending' && (
                        <button className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                          <Play className="w-3 h-3" />开始
                        </button>
                      )}
                      <button className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        <Eye className="w-3 h-3" />详情
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#2A354D] flex items-center justify-between">
          <div className="text-xs text-slate-500">显示 1-5 条，共 5 条</div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>上一页</button>
            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">1</button>
            <button className="px-3 py-1 bg-[#2A354D] text-slate-400 text-xs rounded hover:bg-[#364360] disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SampleAnalysisView;
