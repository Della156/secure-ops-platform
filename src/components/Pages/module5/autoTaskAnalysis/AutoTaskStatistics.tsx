'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle,
  Filter, Download, RefreshCw, Calendar, ChevronDown, Search,
  ArrowUpRight, ArrowDownRight, Activity, Database, Server, Zap
} from 'lucide-react';

interface TaskStat {
  taskName: string;
  taskId: string;
  category: string;
  totalExecutions: number;
  successRate: number;
  avgDuration: number;
  trend: number;
  status: 'normal' | 'warning' | 'error';
}

interface DailyStat {
  date: string;
  total: number;
  success: number;
  failed: number;
  avgDuration: number;
}

const mockTaskStats: TaskStat[] = [
  { taskName: '安全策略巡检', taskId: 'TSK-001', category: '巡检任务', totalExecutions: 156, successRate: 98.7, avgDuration: 125, trend: +2.3, status: 'normal' },
  { taskName: '漏洞扫描', taskId: 'TSK-002', category: '扫描任务', totalExecutions: 89, successRate: 94.3, avgDuration: 456, trend: -1.2, status: 'warning' },
  { taskName: '日志备份', taskId: 'TSK-003', category: '备份任务', totalExecutions: 288, successRate: 100, avgDuration: 89, trend: +0.5, status: 'normal' },
  { taskName: '基线检查', taskId: 'TSK-004', category: '合规任务', totalExecutions: 67, successRate: 87.9, avgDuration: 234, trend: -3.1, status: 'error' },
  { taskName: '告警聚合', taskId: 'TSK-005', category: '分析任务', totalExecutions: 1440, successRate: 99.2, avgDuration: 12, trend: +1.8, status: 'normal' },
  { taskName: '威胁情报同步', taskId: 'TSK-006', category: '同步任务', totalExecutions: 24, successRate: 91.7, avgDuration: 567, trend: -0.8, status: 'warning' },
];

const mockDailyStats: DailyStat[] = [
  { date: '5/27', total: 1245, success: 1198, failed: 47, avgDuration: 156 },
  { date: '5/28', total: 1389, success: 1345, failed: 44, avgDuration: 148 },
  { date: '5/29', total: 1123, success: 1089, failed: 34, avgDuration: 167 },
  { date: '5/30', total: 1456, success: 1398, failed: 58, avgDuration: 152 },
  { date: '5/31', total: 1567, success: 1512, failed: 55, avgDuration: 145 },
  { date: '6/1', total: 1298, success: 1256, failed: 42, avgDuration: 162 },
  { date: '6/2', total: 1432, success: 1389, failed: 43, avgDuration: 158 },
];

function StatCard({ title, value, change, icon, color, unit }: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  unit?: string;
}) {
  return (
    <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
        <span className={`text-${color}-400`}>{icon}</span>
        {title}
      </div>
      <div className="text-2xl font-bold text-white">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </div>
      <div className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(change)}%
      </div>
    </div>
  );
}

function SimpleBarChart({ data, height = 160 }: { data: DailyStat[]; height?: number }) {
  const maxVal = Math.max(...data.map(d => d.total));
  const barWidth = 32;
  const gap = 16;
  const chartWidth = data.length * (barWidth + gap);

  return (
    <svg width="100%" viewBox={`0 0 ${chartWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <line
          key={i}
          x1={0}
          y1={height * p}
          x2={chartWidth}
          y2={height * p}
          stroke="rgba(255,255,255,0.05)"
        />
      ))}
      {data.map((d, i) => {
        const barHeight = (d.total / maxVal) * (height - 20);
        const x = i * (barWidth + gap);
        return (
          <g key={i}>
            <rect
              x={x}
              y={height - barHeight - 10}
              width={barWidth}
              height={barHeight}
              fill="url(#barGrad)"
              rx={4}
            />
            <rect
              x={x}
              y={height - barHeight - 10}
              width={barWidth}
              height={barHeight * (d.success / d.total)}
              fill="#10B981"
              rx={4}
            />
            <text x={x + barWidth / 2} y={height - 2} fill="#64748B" fontSize="10" textAnchor="middle">
              {d.date}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AutoTaskStatistics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [timeRange, setTimeRange] = useState('7d');

  const categories = ['全部', ...new Set(mockTaskStats.map(t => t.category))];

  const filteredStats = useMemo(() => {
    return mockTaskStats.filter(task => {
      const matchSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === '全部' || task.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, categoryFilter]);

  const summaryStats = useMemo(() => {
    const total = mockDailyStats.reduce((acc, d) => acc + d.total, 0);
    const success = mockDailyStats.reduce((acc, d) => acc + d.success, 0);
    const avgDuration = Math.round(mockDailyStats.reduce((acc, d) => acc + d.avgDuration, 0) / mockDailyStats.length);
    return {
      totalTasks: total,
      successRate: ((success / total) * 100).toFixed(1),
      avgDuration,
      totalCategories: mockTaskStats.length,
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            自动任务执行统计分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">分析自动任务的执行情况、成功率和性能指标</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-3 py-1.5"
          >
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
            <option value="90d">近 90 天</option>
          </select>
          <button className="bg-[#111625] border border-[#2A354D] text-gray-300 text-sm px-3 py-1.5 rounded hover:bg-[#20293F] flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            刷新
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="总执行次数"
          value={summaryStats.totalTasks.toLocaleString()}
          change={5.2}
          icon={<Activity className="w-4 h-4" />}
          color="blue"
        />
        <StatCard
          title="平均成功率"
          value={`${summaryStats.successRate}%`}
          change={1.8}
          icon={<CheckCircle2 className="w-4 h-4" />}
          color="green"
        />
        <StatCard
          title="平均执行时长"
          value={summaryStats.avgDuration}
          change={-3.2}
          icon={<Clock className="w-4 h-4" />}
          color="orange"
          unit="ms"
        />
        <StatCard
          title="任务类别"
          value={summaryStats.totalCategories}
          change={0}
          icon={<Database className="w-4 h-4" />}
          color="purple"
          unit="个"
        />
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            每日执行趋势
          </h3>
        </div>
        <SimpleBarChart data={mockDailyStats} />
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-gray-400">总执行</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-gray-400">成功</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-gray-400">失败</span>
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg">
        <div className="p-4 border-b border-[#2A354D]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索任务名称或任务ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg pl-9 pr-4 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">任务名称</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">类别</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">执行次数</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">成功率</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">平均时长</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">趋势</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-400">状态</th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((task) => (
                <tr key={task.taskId} className="border-t border-[#2A354D] hover:bg-[#111625]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">{task.taskName}</div>
                    <div className="text-xs text-gray-500 font-mono">{task.taskId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-400">
                      {task.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white text-sm">{task.totalExecutions}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${task.successRate >= 95 ? 'text-green-400' : task.successRate >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {task.successRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white text-sm">{task.avgDuration}ms</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs flex items-center justify-end gap-1 ${task.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {task.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(task.trend)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {task.status === 'normal' && <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />}
                    {task.status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400 mx-auto" />}
                    {task.status === 'error' && <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#2A354D] flex items-center justify-between">
          <span className="text-xs text-gray-500">共 {filteredStats.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">上一页</button>
            <span className="px-3 py-1 text-xs text-gray-400">1 / 1</span>
            <button className="px-3 py-1 text-xs bg-[#111625] border border-[#2A354D] rounded text-gray-400 hover:bg-[#20293F]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoTaskStatistics;