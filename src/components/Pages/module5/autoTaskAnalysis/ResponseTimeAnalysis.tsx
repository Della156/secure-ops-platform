'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock, TrendingUp, TrendingDown, Activity, Zap,
  Filter, Download, RefreshCw, BarChart2, Target,
  ArrowUpRight, ArrowDownRight, Minus, Server, Database
} from 'lucide-react';

interface ResponseTimeData {
  taskName: string;
  taskId: string;
  avgResponse: number;
  minResponse: number;
  maxResponse: number;
  p95Response: number;
  p99Response: number;
  trend: number;
  category: string;
}

interface TimeBucket {
  time: string;
  avgResponse: number;
  taskCount: number;
}

const mockResponseData: ResponseTimeData[] = [
  { taskName: '安全策略巡检', taskId: 'TSK-001', avgResponse: 125, minResponse: 89, maxResponse: 245, p95Response: 189, p99Response: 234, trend: -5.2, category: '巡检任务' },
  { taskName: '漏洞扫描', taskId: 'TSK-002', avgResponse: 456, minResponse: 321, maxResponse: 890, p95Response: 678, p99Response: 823, trend: +2.1, category: '扫描任务' },
  { taskName: '日志备份', taskId: 'TSK-003', avgResponse: 89, minResponse: 45, maxResponse: 156, p95Response: 134, p99Response: 152, trend: -1.8, category: '备份任务' },
  { taskName: '基线检查', taskId: 'TSK-004', avgResponse: 234, minResponse: 156, maxResponse: 567, p95Response: 423, p99Response: 512, trend: +8.3, category: '合规任务' },
  { taskName: '告警聚合', taskId: 'TSK-005', avgResponse: 12, minResponse: 5, maxResponse: 45, p95Response: 32, p99Response: 41, trend: -3.5, category: '分析任务' },
  { taskName: '威胁情报同步', taskId: 'TSK-006', avgResponse: 567, minResponse: 432, maxResponse: 1234, p95Response: 890, p99Response: 1102, trend: -2.1, category: '同步任务' },
];

const mockTimeBuckets: TimeBucket[] = [
  { time: '00:00', avgResponse: 145, taskCount: 45 },
  { time: '04:00', avgResponse: 123, taskCount: 23 },
  { time: '08:00', avgResponse: 189, taskCount: 156 },
  { time: '12:00', avgResponse: 234, taskCount: 289 },
  { time: '16:00', avgResponse: 212, taskCount: 245 },
  { time: '20:00', avgResponse: 167, taskCount: 178 },
];

function ResponseTimeChart({ data }: { data: TimeBucket[] }) {
  const maxResponse = Math.max(...data.map(d => d.avgResponse));
  const w = 600;
  const h = 200;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const xStep = (w - padL - padR) / (data.length - 1);
  const yScale = (v: number) => padT + (h - padT - padB) * (1 - v / maxResponse);

  const path = data.map((d, i) => {
    const x = padL + i * xStep;
    const y = yScale(d.avgResponse);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <g key={i}>
          <line x1={padL} y1={padT + (h - padT - padB) * p} x2={w - padR} y2={padT + (h - padT - padB) * p} stroke="rgba(255,255,255,0.05)" />
          <text x={padL - 8} y={padT + (h - padT - padB) * p + 4} fill="#64748B" fontSize="10" textAnchor="end">
            {Math.round(maxResponse * (1 - p))}
          </text>
        </g>
      ))}
      <path d={`${path} L ${padL + (data.length - 1) * xStep},${h - padB} L ${padL},${h - padB} Z`} fill="url(#responseGrad)" />
      <path d={path} fill="none" stroke="#10B981" strokeWidth="2" />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={padL + i * xStep}
          cy={yScale(d.avgResponse)}
          r={4}
          fill="#10B981"
          stroke="#0F172A"
          strokeWidth="2"
        />
      ))}
      {data.map((d, i) => (
        <text key={i} x={padL + i * xStep} y={h - padB + 18} fill="#64748B" fontSize="10" textAnchor="middle">
          {d.time}
        </text>
      ))}
    </svg>
  );
}

function ResponseBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-mono">{value}ms</span>
      </div>
      <div className="h-1.5 bg-[#111625] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function ResponseTimeAnalysis() {
  const [selectedTask, setSelectedTask] = useState(mockResponseData[0]);
  const [timeRange, setTimeRange] = useState('24h');

  const summaryStats = useMemo(() => {
    const responses = mockResponseData.map(d => d.avgResponse);
    return {
      overallAvg: Math.round(responses.reduce((acc, d) => acc + d, 0) / responses.length),
      fastest: Math.min(...responses),
      slowest: Math.max(...responses),
      improvement: -3.2,
    };
  }, []);

  const maxResponse = useMemo(() => {
    return Math.max(selectedTask.maxResponse, selectedTask.p99Response);
  }, [selectedTask]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-400" />
            自动化响应时间量化分析
          </h2>
          <p className="text-sm text-gray-400 mt-1">分析自动化任务的响应时间分布、性能趋势和延迟指标</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#111625] border border-[#2A354D] text-white text-sm rounded px-3 py-1.5"
          >
            <option value="6h">近 6 小时</option>
            <option value="24h">近 24 小时</option>
            <option value="7d">近 7 天</option>
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
        {[
          { label: '总体平均响应', value: summaryStats.overallAvg, unit: 'ms', change: summaryStats.improvement, icon: <Clock className="w-4 h-4" />, color: 'green' },
          { label: '最快响应', value: summaryStats.fastest, unit: 'ms', change: 0, icon: <Zap className="w-4 h-4" />, color: 'blue' },
          { label: '最慢响应', value: summaryStats.slowest, unit: 'ms', change: 0, icon: <Target className="w-4 h-4" />, color: 'orange' },
          { label: '性能改善', value: `${Math.abs(summaryStats.improvement)}%`, unit: '', change: summaryStats.improvement, icon: <TrendingUp className="w-4 h-4" />, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              <span className={`text-${stat.color}-400`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white">
              {stat.value}
              {stat.unit && <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>}
            </div>
            {stat.change !== 0 && (
              <div className={`text-xs mt-1 flex items-center gap-1 ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change >= 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              响应时间趋势（按时间段）
            </h3>
          </div>
          <ResponseTimeChart data={mockTimeBuckets} />
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-400">平均响应时间</span>
            </div>
            <div className="text-gray-500">
              单位：毫秒
            </div>
          </div>
        </div>

        <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            任务响应时间排行
          </h3>
          <div className="space-y-2">
            {mockResponseData.sort((a, b) => a.avgResponse - b.avgResponse).slice(0, 5).map((task, i) => (
              <div
                key={task.taskId}
                className={`p-2 rounded cursor-pointer transition-colors ${selectedTask.taskId === task.taskId ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-[#111625] hover:bg-[#20293F]'}`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-orange-700 text-white' :
                      'bg-[#2A354D] text-gray-400'
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm text-white truncate max-w-[140px]">{task.taskName}</div>
                      <div className="text-[10px] text-gray-500">{task.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400">{task.avgResponse}ms</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            任务响应时间详情
          </h3>
          <span className="text-xs text-gray-500">
            当前：<span className="text-white">{selectedTask.taskName}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-[#111625] rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">响应时间分布</div>
              <ResponseBar label="最小响应" value={selectedTask.minResponse} max={maxResponse} color="#10B981" />
              <ResponseBar label="平均响应" value={selectedTask.avgResponse} max={maxResponse} color="#3B82F6" />
              <ResponseBar label="P95响应" value={selectedTask.p95Response} max={maxResponse} color="#F59E0B" />
              <ResponseBar label="P99响应" value={selectedTask.p99Response} max={maxResponse} color="#EF4444" />
              <ResponseBar label="最大响应" value={selectedTask.maxResponse} max={maxResponse} color="#8B5CF6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '最小响应', value: selectedTask.minResponse, unit: 'ms', icon: <TrendingDown className="w-4 h-4" /> },
              { label: '最大响应', value: selectedTask.maxResponse, unit: 'ms', icon: <TrendingUp className="w-4 h-4" /> },
              { label: 'P95延迟', value: selectedTask.p95Response, unit: 'ms', icon: <Activity className="w-4 h-4" /> },
              { label: 'P99延迟', value: selectedTask.p99Response, unit: 'ms', icon: <Target className="w-4 h-4" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-[#111625] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  {stat.icon}
                  {stat.label}
                </div>
                <div className="text-xl font-bold text-white">
                  {stat.value}
                  <span className="text-xs font-normal text-gray-500 ml-1">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2A354D]">
          <h3 className="text-sm font-medium text-white">任务响应时间列表</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#111625]">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">任务名称</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">平均响应</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">最小/最大</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">P95</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">P99</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">趋势</th>
              </tr>
            </thead>
            <tbody>
              {mockResponseData.map((task) => (
                <tr key={task.taskId} className="border-t border-[#2A354D] hover:bg-[#111625]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">{task.taskName}</div>
                    <div className="text-xs text-gray-500">{task.category}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-green-400 font-mono">{task.avgResponse}ms</td>
                  <td className="px-4 py-3 text-right text-white text-sm font-mono">{task.minResponse}/{task.maxResponse}</td>
                  <td className="px-4 py-3 text-right text-yellow-400 font-mono">{task.p95Response}ms</td>
                  <td className="px-4 py-3 text-right text-orange-400 font-mono">{task.p99Response}ms</td>
                  <td className="px-4 py-3 text-right">
                    {task.trend === 0 ? (
                      <Minus className="w-4 h-4 text-gray-500 mx-auto" />
                    ) : task.trend > 0 ? (
                      <span className="text-green-400 flex items-center justify-end gap-1 text-xs">
                        <ArrowUpRight className="w-3 h-3" /> {task.trend}%
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center justify-end gap-1 text-xs">
                        <ArrowDownRight className="w-3 h-3" /> {Math.abs(task.trend)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResponseTimeAnalysis;